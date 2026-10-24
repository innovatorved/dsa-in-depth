/**
 * DSA In Depth — Production Algorithmic Performance & TLE Incident Challenges
 * 12 interactive debugging, asymptotic degradation, and hardware-bottleneck labs.
 * Exposes window.CHALLENGES_DATA as an Array (with .challenges alias for backwards compatibility).
 */
(function(root) {
  'use strict';

  var CHALLENGES_DATA = [
    // =========================================================================
    // 1. Array.shift() Queue Meltdown (O(N^2) Memory-Move Storm)
    // =========================================================================
    {
      id: 'chal-01-array-shift-tle',
      title: 'Ingestion Queue Meltdown: Array.shift() O(N²) Memory-Move Storm',
      subtitle: 'Draining a 250,000-event telemetry batch via Array.prototype.shift() saturates memory bandwidth and stalls the worker loop.',
      summary: 'Replace O(N) contiguous head-deletion (memmove) with a power-of-two circular ring buffer for strict O(1) amortized enqueue/dequeue.',
      severity: 'SEV-1',
      difficulty: 'easy',
      category: 'Contiguous Arrays & Ring Buffers',
      trackId: 'track-1',
      xp: 150,
      estimatedMinutes: 15,
      relatedSlugs: [
        'dynamic-arrays-geometric-resizing',
        'build-dynamic-circular-deque',
        'ram-model-vs-modern-cpu'
      ],
      symptoms: [
        'Telemetry worker CPU utilization pegs at 100% whenever batch queue depth exceeds 60,000 events.',
        'Event-loop lag spikes from 4ms to 8,900ms despite per-event processing taking only 200 nanoseconds.',
        'Hardware perf counters show 94% of CPU cycles spent inside libc memmove / V8 ElementsAccessor::CopyElements.'
      ],
      metricsAndLogs: {
        errorRate: '38.4%',
        latencyP99: '8,920ms',
        downstreamCpu: '99.8%',
        effectiveRps: 420,
        baselineRps: 25000,
        timeseries: [
          { time: '10:00:00', cpu: 18, latencyP99: 8, errorRate: 0.0, rps: 24800 },
          { time: '10:01:00', cpu: 54, latencyP99: 420, errorRate: 2.1, rps: 18200 },
          { time: '10:02:00', cpu: 92, latencyP99: 3800, errorRate: 18.5, rps: 3100 },
          { time: '10:03:00', cpu: 100, latencyP99: 8920, errorRate: 38.4, rps: 420 }
        ],
        logs: [
          { timestamp: '10:01:12.104', level: 'WARN', service: 'ingest-worker', message: 'Queue backlog reached 120,000 items; drain rate dropping quadratically.' },
          { timestamp: '10:02:05.882', level: 'ERROR', service: 'ingest-worker', message: 'Event loop blocked for 4,120ms in Array.prototype.shift (memmove 960KB per pop).' },
          { timestamp: '10:03:01.009', level: 'FATAL', service: 'health-probe', message: 'Worker liveness probe timed out: 250,000 shift() calls = 3.125 × 10^10 element copies.' }
        ]
      },
      slaImpact: 'Telemetry pipeline drops 38.4% of incoming metrics batches when burst size exceeds 100K events.',
      rootCauses: [
        {
          id: 'rc-gc-pause',
          description: 'V8 Scavenger garbage collection is thrashing due to allocating short-lived event wrapper objects.',
          correct: false,
          feedback: 'Incorrect. Allocation size is small; CPU profiling points directly to contiguous element shifting inside Array.prototype.shift().'
        },
        {
          id: 'rc-quadratic-shift',
          description: 'Array.prototype.shift() moves all remaining N-1 elements left by one slot on every dequeue, turning N dequeues into Θ(N²) memory copies.',
          correct: true,
          feedback: 'Spot on! Shifting N = 250,000 elements performs N(N-1)/2 ≈ 31.25 billion pointer moves, saturating L3 cache and DRAM bandwidth.'
        },
        {
          id: 'rc-lock-contention',
          description: 'Mutex contention between producer and consumer threads on the shared array reference.',
          correct: false,
          feedback: 'Incorrect. Node.js workers process the queue on a single thread; the bottleneck is purely algorithmic Θ(N²) data movement.'
        },
        {
          id: 'rc-holey-elements',
          description: 'Deleting array elements transitions V8 from PACKED_ELEMENTS to dictionary mode.',
          correct: false,
          feedback: 'Incorrect. shift() keeps the array packed by copying elements down, which is the exact reason it costs O(N) per call.'
        }
      ],
      invariants: [
        'A FIFO queue backed by a circular buffer of power-of-two capacity C = 2^k advances head and tail via bitwise masking: index = (index + 1) & (C - 1).',
        'Geometric 2× capacity doubling when size === capacity copies N elements once every N insertions, guaranteeing O(1) amortized push and O(1) worst-case pop.',
        'Clearing dequeued slots to undefined prevents memory leaks (loitering references) without shifting the remaining array.'
      ],
      interactiveTuning: [
        {
          id: 'queueStructure',
          label: 'Underlying Queue Data Structure',
          type: 'select',
          options: ['js-array-shift', 'linked-list-nodes', 'circular-ring-buffer'],
          defaultValue: 'js-array-shift',
          description: 'Select the physical memory representation for the FIFO event queue.'
        },
        {
          id: 'initialCapacityPow2',
          label: 'Initial Ring Capacity (2^k)',
          type: 'range',
          min: 64,
          max: 65536,
          step: 64,
          defaultValue: 256,
          unit: 'slots',
          description: 'Pre-allocated power-of-two buffer capacity to minimize early geometric resizes.'
        },
        {
          id: 'growthFactor',
          label: 'Resize Growth Factor',
          type: 'select',
          options: ['additive-1000', 'geometric-2x'],
          defaultValue: 'additive-1000',
          description: 'Capacity expansion strategy when the ring buffer reaches 100% occupancy.'
        },
        {
          id: 'batchDrainSize',
          label: 'Per-Tick Drain Batch Size',
          type: 'range',
          min: 500,
          max: 10000,
          step: 500,
          defaultValue: 500,
          unit: 'events',
          description: 'Maximum events dequeued per event-loop turn before yielding.'
        }
      ],
      optimalPreset: {
        queueStructure: 'circular-ring-buffer',
        initialCapacityPow2: 16384,
        growthFactor: 'geometric-2x',
        batchDrainSize: 5000
      },
      verify: function(knobs) {
        var isRing = knobs.queueStructure === 'circular-ring-buffer';
        var isGeom = knobs.growthFactor === 'geometric-2x';
        var goodCap = Number(knobs.initialCapacityPow2) >= 4096;
        var goodBatch = Number(knobs.batchDrainSize) >= 2000;
        var ok = isRing && isGeom && goodCap && goodBatch;
        return {
          success: ok,
          message: ok
            ? 'Mitigation verified! Power-of-two circular ring buffer with 2× geometric growth reduced 250K-event drain time from 8,920ms to 3.4ms (O(1) amortized).'
            : 'Queue still suffers from quadratic memory copies or frequent reallocations. Select circular-ring-buffer, geometric-2x growth, capacity >= 4096, and batch >= 2000.',
          metrics: {
            latencyP99: ok ? '3.4ms' : (isRing ? '48ms' : '8,920ms'),
            errorRate: ok ? '0.00%' : '14.2%',
            downstreamCpu: ok ? '14.2%' : '96.0%',
            effectiveRps: ok ? 25000 : 1200
          }
        };
      },
      codeFix: {
        title: 'Replace O(N) Array.shift() with Power-of-Two Circular Ring Queue',
        summary: 'Implement RingQueue with bitwise index wrapping ((head + 1) & mask) and 2× geometric capacity doubling so draining N items runs in O(N) total time.',
        buggyCode: `class IngestionQueue {
  constructor() {
    this.items = [];
  }
  enqueue(item) {
    this.items.push(item);
  }
  dequeue() {
    if (this.items.length === 0) return undefined;
    // BUG: O(N) memmove on every dequeue!
    return this.items.shift();
  }
  size() {
    return this.items.length;
  }
}`,
        solutionCode: `class IngestionQueue {
  constructor(initialCapacity = 1024) {
    let cap = 1;
    while (cap < initialCapacity) cap <<= 1;
    this.buf = new Array(cap);
    this.mask = cap - 1;
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }
  _grow() {
    const oldCap = this.buf.length;
    const newCap = oldCap << 1;
    const next = new Array(newCap);
    for (let i = 0; i < this.count; i++) {
      next[i] = this.buf[(this.head + i) & this.mask];
    }
    this.buf = next;
    this.mask = newCap - 1;
    this.head = 0;
    this.tail = this.count;
  }
  enqueue(item) {
    if (this.count === this.buf.length) this._grow();
    this.buf[this.tail] = item;
    this.tail = (this.tail + 1) & this.mask;
    this.count++;
  }
  dequeue() {
    if (this.count === 0) return undefined;
    const val = this.buf[this.head];
    this.buf[this.head] = undefined;
    this.head = (this.head + 1) & this.mask;
    this.count--;
    return val;
  }
  size() {
    return this.count;
  }
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
const q = new IngestionQueue(4);
const N = 50000;
const t0 = Date.now();
for (let i = 0; i < N; i++) q.enqueue(i);
assert.strictEqual(q.size(), N);
for (let i = 0; i < N / 2; i++) {
  assert.strictEqual(q.dequeue(), i);
}
for (let i = N; i < N + 10000; i++) q.enqueue(i);
let expected = N / 2;
while (q.size() > 0) {
  assert.strictEqual(q.dequeue(), expected++);
}
assert.strictEqual(expected, N + 10000);
assert.strictEqual(q.dequeue(), undefined);
const elapsed = Date.now() - t0;
assert(elapsed < 500, 'Expected O(N) ring buffer under 500ms, took ' + elapsed + 'ms');
console.log('PASS');`
      }
    },

    // =========================================================================
    // 2. Unbounded LRU Cache Eviction Scan Stall (O(N) Eviction vs O(1) List)
    // =========================================================================
    {
      id: 'chal-02-lru-cache-scan-stall',
      title: 'Session Cache Tail-Latency Spike: O(N) Linear-Scan LRU Eviction',
      subtitle: 'Scanning all 100,000 cache entries to find the oldest timestamp on every cache miss turns O(1) lookups into an O(N) CPU stall.',
      summary: 'Combine a hash map with an intrusive doubly-linked recency list (or insertion-ordered Map re-insertion) for strict O(1) get, put, and eviction.',
      severity: 'SEV-1',
      difficulty: 'easy',
      category: 'Linked Structures & Cache Eviction',
      trackId: 'track-1',
      xp: 175,
      estimatedMinutes: 15,
      relatedSlugs: [
        'lru-lfu-eviction-structures',
        'build-lfu-lru-cache',
        'singly-doubly-intrusive-lists'
      ],
      symptoms: [
        'Cache warm-up runs at 45,000 QPS until capacity reaches 100,000 keys, then throughput collapses by 97% to 1,100 QPS.',
        'Flamegraphs show 89% of CPU time inside evictOldest() iterating over Map.entries().',
        'P99 latency jumps from 0.8ms to 640ms immediately after the cache reaches 100% capacity.'
      ],
      metricsAndLogs: {
        errorRate: '22.0%',
        latencyP99: '640ms',
        downstreamCpu: '98.5%',
        effectiveRps: 1100,
        baselineRps: 45000,
        timeseries: [
          { time: '14:10:00', cpu: 22, latencyP99: 0.8, errorRate: 0.0, rps: 44900 },
          { time: '14:11:00', cpu: 45, latencyP99: 1.2, errorRate: 0.0, rps: 45100 },
          { time: '14:12:00', cpu: 99, latencyP99: 520, errorRate: 17.4, rps: 1450 },
          { time: '14:13:00', cpu: 99, latencyP99: 640, errorRate: 22.0, rps: 1100 }
        ],
        logs: [
          { timestamp: '14:11:58.201', level: 'INFO', service: 'session-cache', message: 'Cache reached maxCapacity=100,000 keys. Eviction policy active.' },
          { timestamp: '14:12:04.512', level: 'WARN', service: 'session-cache', message: 'evictOldest() scanned 100,000 entries in 4.8ms for a single put() call.' },
          { timestamp: '14:12:30.904', level: 'ERROR', service: 'api-gateway', message: 'Upstream timeout waiting for session-cache: 500 cache misses triggered 5 × 10^7 key comparisons.' }
        ]
      },
      slaImpact: 'Authentication middleware times out for 22% of active users whenever working-set cardinality exceeds cache capacity.',
      rootCauses: [
        {
          id: 'rc-hash-collision',
          description: 'V8 Map hash table buckets are colliding due to sequential session ID strings.',
          correct: false,
          feedback: 'Incorrect. V8 deterministic hash tables handle sequential strings in O(1); the slowdown only begins once capacity is full and eviction triggers.'
        },
        {
          id: 'rc-linear-eviction-scan',
          description: 'Evicting the least-recently-used key via a full O(N) linear scan over all stored timestamps makes every cache miss cost Θ(capacity) time.',
          correct: true,
          feedback: 'Correct! At capacity N = 100,000, every cache miss scans 100,000 entries. Maintaining a doubly-linked recency list reduces eviction to O(1) pointer splicing.'
        },
        {
          id: 'rc-json-clone',
          description: 'Deep-cloning session payloads on cache hits saturates memory bandwidth.',
          correct: false,
          feedback: 'Incorrect. Latency was 0.8ms during cache hits before eviction started.'
        },
        {
          id: 'rc-clock-syscall',
          description: 'Calling Date.now() on every get() triggers a kernel vDSO context switch.',
          correct: false,
          feedback: 'Incorrect. Even with monotonic counters, scanning N entries on every miss is Θ(N).'
        }
      ],
      invariants: [
        'An O(1) LRU cache maintains a bijection between hash map entries (key → node) and an intrusive doubly-linked list ordered from MRU (head) to LRU (tail).',
        'Every get(key) or put(key) detaches the node in O(1) via node.prev.next = node.next and splices it immediately after the dummy head sentinel.',
        'When size > capacity, the victim is strictly tail.prev, which is unlinked and deleted from the hash map in O(1) worst-case time.'
      ],
      interactiveTuning: [
        {
          id: 'evictionIndex',
          label: 'Recency Tracking Structure',
          type: 'select',
          options: ['linear-timestamp-scan', 'min-heap-timestamps', 'intrusive-doubly-linked-list'],
          defaultValue: 'linear-timestamp-scan',
          description: 'Data structure used to locate and evict the least-recently-used key.'
        },
        {
          id: 'sentinelNodes',
          label: 'Boundary Handling',
          type: 'select',
          options: ['nullable-head-tail-branches', 'dummy-head-tail-sentinels'],
          defaultValue: 'nullable-head-tail-branches',
          description: 'Use dummy head/tail sentinel nodes to eliminate null-check branches during O(1) splice.'
        },
        {
          id: 'shardCount',
          label: 'Cache Segment Shards',
          type: 'range',
          min: 1,
          max: 64,
          step: 1,
          defaultValue: 1,
          unit: 'shards',
          description: 'Number of independent hash+DLL shards to reduce per-shard working set.'
        },
        {
          id: 'maxCapacity',
          label: 'Total Cache Capacity',
          type: 'range',
          min: 50000,
          max: 250000,
          step: 25000,
          defaultValue: 100000,
          unit: 'keys',
          description: 'Maximum keys retained before LRU eviction.'
        }
      ],
      optimalPreset: {
        evictionIndex: 'intrusive-doubly-linked-list',
        sentinelNodes: 'dummy-head-tail-sentinels',
        shardCount: 16,
        maxCapacity: 150000
      },
      verify: function(knobs) {
        var isDll = knobs.evictionIndex === 'intrusive-doubly-linked-list';
        var isSentinel = knobs.sentinelNodes === 'dummy-head-tail-sentinels';
        var goodCap = Number(knobs.maxCapacity) >= 100000;
        var ok = isDll && isSentinel && goodCap;
        return {
          success: ok,
          message: ok
            ? 'Recovery complete! Intrusive doubly-linked list with dummy sentinels restored O(1) worst-case eviction and 0.9ms P99 latency at 45,000 QPS.'
            : 'Eviction still incurs O(N) or O(log N) overhead or branch-heavy pointer updates. Select intrusive-doubly-linked-list with dummy-head-tail-sentinels.',
          metrics: {
            latencyP99: ok ? '0.9ms' : '640ms',
            errorRate: ok ? '0.00%' : '22.0%',
            downstreamCpu: ok ? '19.4%' : '98.5%',
            effectiveRps: ok ? 45000 : 1100
          }
        };
      },
      codeFix: {
        title: 'Implement O(1) Hash Map + Doubly-Linked List LRU Cache',
        summary: 'Replace the O(N) timestamp scan in put() with an intrusive doubly-linked list with dummy head/tail sentinels so get() and put() run in strict O(1) time.',
        buggyCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.store = new Map();
    this.tick = 0;
  }
  get(key) {
    if (!this.store.has(key)) return -1;
    const entry = this.store.get(key);
    entry.time = ++this.tick;
    return entry.value;
  }
  put(key, value) {
    if (this.store.has(key)) {
      this.store.set(key, { value, time: ++this.tick });
      return;
    }
    if (this.store.size >= this.capacity) {
      // BUG: O(N) linear scan over all keys on every eviction!
      let oldestKey = null, oldestTime = Infinity;
      for (const [k, v] of this.store.entries()) {
        if (v.time < oldestTime) {
          oldestTime = v.time;
          oldestKey = k;
        }
      }
      this.store.delete(oldestKey);
    }
    this.store.set(key, { value, time: ++this.tick });
  }
}`,
        solutionCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = { key: null, value: null, prev: null, next: null };
    this.tail = { key: null, value: null, prev: this.head, next: null };
    this.head.next = this.tail;
  }
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  _insertFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;
    this._remove(node);
    this._insertFront(node);
    return node.value;
  }
  put(key, value) {
    let node = this.map.get(key);
    if (node) {
      node.value = value;
      this._remove(node);
      this._insertFront(node);
      return;
    }
    if (this.map.size >= this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
    node = { key, value, prev: null, next: null };
    this._insertFront(node);
    this.map.set(key, node);
  }
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
const cache = new LRUCache(2);
cache.put(1, 10);
cache.put(2, 20);
assert.strictEqual(cache.get(1), 10);
cache.put(3, 30); // evicts key 2
assert.strictEqual(cache.get(2), -1);
cache.put(4, 40); // evicts key 1
assert.strictEqual(cache.get(1), -1);
assert.strictEqual(cache.get(3), 30);
assert.strictEqual(cache.get(4), 40);

const big = new LRUCache(5000);
const t0 = Date.now();
for (let i = 0; i < 30000; i++) {
  big.put(i, i * 2);
  if (i % 3 === 0) big.get(i - 1);
}
assert(Date.now() - t0 < 300, 'Expected O(1) LRU operations');
console.log('PASS');`
      }
    },

    // =========================================================================
    // 3. Adversarial HashDoS Collision Storm (Unseeded Hash & Linear Probing)
    // =========================================================================
    {
      id: 'chal-03-hashdos-collision-storm',
      title: 'Adversarial HashDoS Outage: O(N²) Collision Chain in Unseeded Hash Map',
      subtitle: 'A single 2MB HTTP POST containing 40,000 crafted keys with identical DJB2 hashes freezes the request parser for 14.2 seconds.',
      summary: 'Mitigate algorithmic complexity attacks by mixing a per-instance random seed into a 64-bit avalanche finalizer and enforcing Robin Hood probe sequence length (PSL) bounds.',
      severity: 'SEV-1',
      difficulty: 'medium',
      category: 'Hash Tables & Cryptographic Seeding',
      trackId: 'track-2',
      xp: 225,
      estimatedMinutes: 20,
      relatedSlugs: [
        'hashdos-siphash-random-seeds',
        'robin-hood-cuckoo-hashing',
        'build-robin-hood-hash-map'
      ],
      symptoms: [
        'API workers freeze for 14+ seconds when parsing specific 40,000-key JSON payloads.',
        'Hash table load factor is only 0.42, yet maximum probe sequence length (maxPSL) reaches 39,998.',
        'All 40,000 keys use two-character equivalents ("Az", "B[", "C<") that cancel out in unseeded polynomial hash h = h * 31 + c.'
      ],
      metricsAndLogs: {
        errorRate: '64.0%',
        latencyP99: '14,200ms',
        downstreamCpu: '100.0%',
        effectiveRps: 18,
        baselineRps: 12000,
        timeseries: [
          { time: '02:15:00', cpu: 24, latencyP99: 4.1, errorRate: 0.0, rps: 11900 },
          { time: '02:16:00', cpu: 100, latencyP99: 9800, errorRate: 41.2, rps: 190 },
          { time: '02:17:00', cpu: 100, latencyP99: 14200, errorRate: 64.0, rps: 18 }
        ],
        logs: [
          { timestamp: '02:15:44.012', level: 'WARN', service: 'metadata-index', message: 'Hash table insert probe count exceeded 10,000 on bucket 0x1F4A (loadFactor=0.41).' },
          { timestamp: '02:16:02.771', level: 'ERROR', service: 'metadata-index', message: 'Adversarial collision detected: 40,000 distinct keys mapped to identical 32-bit hash 0x001A9F20.' },
          { timestamp: '02:16:19.004', level: 'FATAL', service: 'ingress-proxy', message: 'Upstream worker killed by watchdog after 15,000ms CPU spin in HashMap.set().' }
        ]
      },
      slaImpact: 'An unauthenticated attacker sending 4 requests/sec can pin 100% of API cluster CPU cores (HashDoS vulnerability).',
      rootCauses: [
        {
          id: 'rc-load-factor-high',
          description: 'The hash table load factor threshold of 0.75 is too high for open addressing.',
          correct: false,
          feedback: 'Incorrect. Even at load factor 0.05, keys with identical hashes collide into the exact same home slot.'
        },
        {
          id: 'rc-unseeded-polynomial-hash',
          description: 'A deterministic, unseeded polynomial hash (h * 31 + c) allows attackers to precompute colliding keys via meet-in-the-middle, degrading insertion of N keys to Θ(N²) probes.',
          correct: true,
          feedback: 'Exact diagnosis! Without a per-instance random seed and avalanche bit-mixing, an adversary can deterministically craft N keys that map to the same home bucket.'
        },
        {
          id: 'rc-prime-modulus',
          description: 'Using a power-of-two capacity instead of a prime number causes all keys to collide.',
          correct: false,
          feedback: 'Incorrect. The colliding keys share the exact same full 32-bit hash value before any modulo or mask is applied.'
        },
        {
          id: 'rc-tombstone-bloat',
          description: 'Deleted tombstone slots are accumulating and preventing probe termination.',
          correct: false,
          feedback: 'Incorrect. The outage occurs on a fresh table during bulk insertion with zero deletions.'
        }
      ],
      invariants: [
        'A Universal / SipHash-seeded hash family incorporates a secret per-table random seed s so P_s[h_s(x) = h_s(y)] ≤ 1/M for any distinct x ≠ y chosen by an oblivious adversary.',
        'Murmur3 / SplitMix32 finalizer stages (h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b)) guarantee the strict avalanche criterion: flipping 1 input bit flips ~50% of output bits.',
        'Robin Hood hashing swaps an incoming key with the incumbent whenever incoming PSL > incumbent PSL, bounding probe variance to O(log log N).'
      ],
      interactiveTuning: [
        {
          id: 'hashFamily',
          label: 'Hash Function & Seeding',
          type: 'select',
          options: ['unseeded-djb2-31', 'crc32-static', 'seeded-avalanche-murmur-siphash'],
          defaultValue: 'unseeded-djb2-31',
          description: 'Hash function family and secret per-instance seed entropy.'
        },
        {
          id: 'probingScheme',
          label: 'Collision Resolution Strategy',
          type: 'select',
          options: ['naive-linear-probing', 'robin-hood-psl-swap'],
          defaultValue: 'naive-linear-probing',
          description: 'Open-addressing probe ordering and PSL variance reduction.'
        },
        {
          id: 'maxLoadFactorPercent',
          label: 'Max Load Factor Before 2× Rehash',
          type: 'range',
          min: 50,
          max: 95,
          step: 5,
          defaultValue: 90,
          unit: '%',
          description: 'Maximum table occupancy before doubling capacity and re-seeding.'
        },
        {
          id: 'pslReseedThreshold',
          label: 'Max Probe Sequence Length (PSL) Guard',
          type: 'range',
          min: 32,
          max: 512,
          step: 32,
          defaultValue: 512,
          unit: 'probes',
          description: 'Trigger immediate re-seeded rehash if any insertion exceeds this PSL.'
        }
      ],
      optimalPreset: {
        hashFamily: 'seeded-avalanche-murmur-siphash',
        probingScheme: 'robin-hood-psl-swap',
        maxLoadFactorPercent: 75,
        pslReseedThreshold: 64
      },
      verify: function(knobs) {
        var isSeeded = knobs.hashFamily === 'seeded-avalanche-murmur-siphash';
        var isRH = knobs.probingScheme === 'robin-hood-psl-swap';
        var goodLoad = Number(knobs.maxLoadFactorPercent) <= 80;
        var goodPsl = Number(knobs.pslReseedThreshold) <= 128;
        var ok = isSeeded && isRH && goodLoad && goodPsl;
        return {
          success: ok,
          message: ok
            ? 'HashDoS neutralized! Per-instance random seed + Murmur3 avalanche mixing + Robin Hood probing reduced max PSL from 39,998 to 5 and P99 latency to 3.8ms.'
            : 'Table remains vulnerable to adversarial collisions or high probe variance. Enable seeded-avalanche-murmur-siphash, robin-hood-psl-swap, load factor <= 80%, and PSL guard <= 128.',
          metrics: {
            latencyP99: ok ? '3.8ms' : '14,200ms',
            errorRate: ok ? '0.00%' : '64.0%',
            downstreamCpu: ok ? '21.0%' : '100.0%',
            effectiveRps: ok ? 12000 : 18
          }
        };
      },
      codeFix: {
        title: 'Harden Open-Addressed Hash Map with Per-Instance Seed & Robin Hood Probing',
        summary: 'Replace the unseeded *31 polynomial hash (vulnerable to "Aa"/"BB" collisions) with a per-instance random seed + Murmur3 32-bit avalanche mixer and Robin Hood PSL swapping.',
        buggyCode: `class FastHashMap {
  constructor(capacity = 1024) {
    this.cap = capacity;
    this.keys = new Array(capacity);
    this.vals = new Array(capacity);
    this.size = 0;
  }
  _hash(str) {
    // BUG: Unseeded polynomial hash! "Aa" and "BB" have identical hash:
    // 'A'(65)*31 + 'a'(97) = 2112; 'B'(66)*31 + 'B'(66) = 2112!
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
    }
    return h >>> 0;
  }
  set(key, val) {
    let idx = this._hash(key) & (this.cap - 1);
    while (this.keys[idx] !== undefined && this.keys[idx] !== key) {
      idx = (idx + 1) & (this.cap - 1);
    }
    if (this.keys[idx] === undefined) this.size++;
    this.keys[idx] = key;
    this.vals[idx] = val;
  }
  get(key) {
    let idx = this._hash(key) & (this.cap - 1);
    while (this.keys[idx] !== undefined) {
      if (this.keys[idx] === key) return this.vals[idx];
      idx = (idx + 1) & (this.cap - 1);
    }
    return undefined;
  }
}`,
        solutionCode: `class FastHashMap {
  constructor(capacity = 1024) {
    let cap = 16;
    while (cap < capacity) cap <<= 1;
    this.cap = cap;
    this.mask = cap - 1;
    this.keys = new Array(cap);
    this.vals = new Array(cap);
    this.psls = new Int32Array(cap);
    this.size = 0;
    this.seed = ((Math.random() * 0x7fffffff) | 0) ^ 0x9e3779b9;
  }
  _hash(str) {
    let h = this.seed ^ str.length;
    for (let i = 0; i < str.length; i++) {
      let k = str.charCodeAt(i);
      k = Math.imul(k, 0xcc9e2d51);
      k = (k << 15) | (k >>> 17);
      k = Math.imul(k, 0x1b873593);
      h ^= k;
      h = (h << 13) | (h >>> 19);
      h = (Math.imul(h, 5) + 0xe6546b64) | 0;
    }
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
  }
  _grow() {
    const oldK = this.keys, oldV = this.vals;
    this.cap <<= 1;
    this.mask = this.cap - 1;
    this.keys = new Array(this.cap);
    this.vals = new Array(this.cap);
    this.psls = new Int32Array(this.cap);
    this.size = 0;
    for (let i = 0; i < oldK.length; i++) {
      if (oldK[i] !== undefined) this.set(oldK[i], oldV[i]);
    }
  }
  set(key, val) {
    if ((this.size + 1) * 4 >= this.cap * 3) this._grow();
    let idx = this._hash(key) & this.mask;
    let psl = 0;
    let k = key, v = val;
    while (true) {
      if (this.keys[idx] === undefined) {
        this.keys[idx] = k;
        this.vals[idx] = v;
        this.psls[idx] = psl;
        this.size++;
        return;
      }
      if (this.keys[idx] === k) {
        this.vals[idx] = v;
        return;
      }
      if (psl > this.psls[idx]) {
        const tk = this.keys[idx], tv = this.vals[idx], tp = this.psls[idx];
        this.keys[idx] = k; this.vals[idx] = v; this.psls[idx] = psl;
        k = tk; v = tv; psl = tp;
      }
      idx = (idx + 1) & this.mask;
      psl++;
    }
  }
  get(key) {
    let idx = this._hash(key) & this.mask;
    let psl = 0;
    while (this.keys[idx] !== undefined) {
      if (psl > this.psls[idx]) return undefined;
      if (this.keys[idx] === key) return this.vals[idx];
      idx = (idx + 1) & this.mask;
      psl++;
    }
    return undefined;
  }
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
// Generate 4,096 adversarial DJB2/*31 colliding strings made of "Aa" and "BB"
const pairs = ['Aa', 'BB'];
const adversarial = [];
for (let i = 0; i < 4096; i++) {
  let s = '';
  for (let b = 0; b < 12; b++) s += pairs[(i >> b) & 1];
  adversarial.push(s);
}
const map = new FastHashMap(8192);
const t0 = Date.now();
for (let i = 0; i < adversarial.length; i++) {
  map.set(adversarial[i], i);
}
for (let i = 0; i < adversarial.length; i++) {
  assert.strictEqual(map.get(adversarial[i]), i);
}
assert.strictEqual(map.get('non-existent-key'), undefined);
const elapsed = Date.now() - t0;
assert(elapsed < 200, 'Expected O(N) seeded Robin Hood under 200ms, took ' + elapsed + 'ms');
console.log('PASS');`
      }
    },

    // =========================================================================
    // 4. Quicksort O(N^2) Partition Collapse on Duplicate Keys (3-Way Dutch Flag)
    // =========================================================================
    {
      id: 'chal-04-quicksort-dutch-flag-degeneracy',
      title: 'Telemetry Sorter Crash: Quicksort Θ(N²) Collapse on High-Duplicate Keys',
      subtitle: 'Lomuto 2-way Quicksort triggers Maximum Call Stack Size Exceeded and Θ(N²) CPU spikes when sorting 200,000 HTTP status logs where 92% of keys equal 200.',
      summary: 'Replace 2-way Lomuto partitioning with Dijkstra/Bentley-McIlroy 3-way Dutch National Flag partitioning (< pivot, == pivot, > pivot) and median-of-three pivot selection.',
      severity: 'SEV-1',
      difficulty: 'medium',
      category: 'Sorting Mechanics & Partition Invariants',
      trackId: 'track-2',
      xp: 200,
      estimatedMinutes: 20,
      relatedSlugs: [
        'quicksort-partition-schemes',
        'case-timsort-pdqsort',
        'build-hybrid-introsort-timsort'
      ],
      symptoms: [
        'Sorting 100,000 random UUIDs completes in 18ms, but sorting 100,000 HTTP status-code records crashes with RangeError: Maximum call stack size exceeded.',
        'When stack size is increased, sorting 100,000 status codes takes 9,400ms (500× slower than random data).',
        'Partition trace shows every recursive split produces sizes (0, N - 1) whenever all elements equal the pivot.'
      ],
      metricsAndLogs: {
        errorRate: '100.0%',
        latencyP99: '9,450ms',
        downstreamCpu: '99.9%',
        effectiveRps: 0,
        baselineRps: 850,
        timeseries: [
          { time: '08:00:00', cpu: 15, latencyP99: 19, errorRate: 0.0, rps: 845 },
          { time: '08:01:00', cpu: 99, latencyP99: 9450, errorRate: 100.0, rps: 0 }
        ],
        logs: [
          { timestamp: '08:01:02.110', level: 'WARN', service: 'log-aggregator', message: 'Sorting batch of 100,000 records by status_code (cardinality k=5, 92% equal to 200).' },
          { timestamp: '08:01:06.840', level: 'ERROR', service: 'log-aggregator', message: 'Quicksort recursion depth exceeded 10,480 frames on subproblem [0..89,412].' },
          { timestamp: '08:01:11.552', level: 'FATAL', service: 'log-aggregator', message: 'RangeError: Maximum call stack size exceeded at lomutoQuickSort (sorter.js:18).' }
        ]
      },
      slaImpact: 'Log aggregation pipeline completely halts on any low-cardinality column (status_code, region, tier).',
      rootCauses: [
        {
          id: 'rc-random-pivot-only',
          description: 'Selecting a uniformly random pivot without changing the 2-way Lomuto partition loop.',
          correct: false,
          feedback: 'Incorrect! Even with a random pivot, if 92% of elements equal 200, a 2-way Lomuto partition puts all equal elements on one side, still recursing to depth O(N) in Θ(N²) time!'
        },
        {
          id: 'rc-two-way-equal-keys',
          description: '2-way Lomuto partitioning places all elements equal to the pivot into a single partition instead of grouping them into a middle == zone, causing Θ(N²) comparisons and O(N) stack depth on duplicate keys.',
          correct: true,
          feedback: 'Bingo! 3-way Dutch National Flag partitioning groups all elements equal to the pivot into [lt..gt] and excludes them from both recursive calls, achieving O(N) time when key cardinality is constant!'
        },
        {
          id: 'rc-js-v8-smi',
          description: 'Swapping integer status codes causes V8 to deoptimize from PACKED_SMI_ELEMENTS to DOUBLE_ELEMENTS.',
          correct: false,
          feedback: 'Incorrect. Integer swaps preserve PACKED_SMI_ELEMENTS; the failure is asymptotic Θ(N²) recursion.'
        },
        {
          id: 'rc-cache-associativity',
          description: 'L1 cache set-associativity conflicts occur when array length is a multiple of 100,000.',
          correct: false,
          feedback: 'Incorrect. Cache associativity cannot cause a 10,000-frame call stack overflow.'
        }
      ],
      invariants: [
        'Dutch National Flag 3-way partition maintains 4 regions in [lo..hi]: a[lo..lt-1] < pivot, a[lt..i-1] == pivot, a[i..gt] unclassified, and a[gt+1..hi] > pivot.',
        'All elements equal to the pivot land in [lt..gt] and are never touched again in recursive subcalls [lo..lt-1] and [gt+1..hi].',
        'On an array with k distinct keys, 3-way Quicksort completes in O(N log k) comparisons (and O(N) when k = O(1)) with entropy-optimal performance.'
      ],
      interactiveTuning: [
        {
          id: 'partitionScheme',
          label: 'Quicksort Partitioning Scheme',
          type: 'select',
          options: ['lomuto-2way-last', 'hoare-2way', 'dutch-flag-3way'],
          defaultValue: 'lomuto-2way-last',
          description: 'How elements equal to the pivot are partitioned across recursive calls.'
        },
        {
          id: 'pivotSelector',
          label: 'Pivot Selection Strategy',
          type: 'select',
          options: ['fixed-last-element', 'median-of-three-ninther'],
          defaultValue: 'fixed-last-element',
          description: 'Method for selecting the partitioning pivot to avoid sorted/reverse-sorted traps.'
        },
        {
          id: 'smallSubarrayCutoff',
          label: 'Insertion Sort Cutoff',
          type: 'range',
          min: 1,
          max: 32,
          step: 1,
          defaultValue: 1,
          unit: 'elements',
          description: 'Switch to insertion sort for subarrays smaller than this threshold.'
        },
        {
          id: 'tailCallElimination',
          label: 'Stack Depth Bounding',
          type: 'select',
          options: ['unbounded-both-branches', 'recurse-smaller-loop-larger'],
          defaultValue: 'unbounded-both-branches',
          description: 'Guarantee O(log N) worst-case call stack depth by recursing only on the smaller side.'
        }
      ],
      optimalPreset: {
        partitionScheme: 'dutch-flag-3way',
        pivotSelector: 'median-of-three-ninther',
        smallSubarrayCutoff: 16,
        tailCallElimination: 'recurse-smaller-loop-larger'
      },
      verify: function(knobs) {
        var is3Way = knobs.partitionScheme === 'dutch-flag-3way';
        var isMed3 = knobs.pivotSelector === 'median-of-three-ninther';
        var goodCutoff = Number(knobs.smallSubarrayCutoff) >= 8;
        var isTailSafe = knobs.tailCallElimination === 'recurse-smaller-loop-larger';
        var ok = is3Way && isMed3 && goodCutoff && isTailSafe;
        return {
          success: ok,
          message: ok
            ? 'Sorter stabilized! 3-way Dutch National Flag partitioning + median-of-three + smaller-first recursion sorted 200,000 duplicate-heavy logs in 4.2ms with max stack depth 14.'
            : 'Sorter remains vulnerable to duplicate keys or deep recursion. Enable dutch-flag-3way, median-of-three-ninther, cutoff >= 8, and recurse-smaller-loop-larger.',
          metrics: {
            latencyP99: ok ? '4.2ms' : '9,450ms',
            errorRate: ok ? '0.00%' : '100.0%',
            downstreamCpu: ok ? '16.5%' : '99.9%',
            effectiveRps: ok ? 850 : 0
          }
        };
      },
      codeFix: {
        title: 'Replace 2-Way Lomuto Quicksort with 3-Way Dutch National Flag Quicksort',
        summary: 'Implement 3-way partitioning (lt, i, gt) with median-of-three pivot selection so arrays with many duplicate keys sort in O(N) time without stack overflow.',
        buggyCode: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  // BUG: Fixed last-element pivot + 2-way Lomuto partition degrades to O(N^2)
  // and O(N) recursion depth on duplicate keys or already-sorted arrays!
  const pivot = arr[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      i++;
    }
  }
  const tmp = arr[i]; arr[i] = arr[hi]; arr[hi] = tmp;
  quickSort(arr, lo, i - 1);
  quickSort(arr, i + 1, hi);
  return arr;
}`,
        solutionCode: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  while (lo < hi) {
    const mid = lo + ((hi - lo) >>> 1);
    if (arr[mid] < arr[lo]) { const t = arr[lo]; arr[lo] = arr[mid]; arr[mid] = t; }
    if (arr[hi] < arr[lo]) { const t = arr[lo]; arr[lo] = arr[hi]; arr[hi] = t; }
    if (arr[mid] < arr[hi]) { const t = arr[mid]; arr[mid] = arr[hi]; arr[hi] = t; }
    const pivot = arr[hi];

    let lt = lo, i = lo, gt = hi;
    while (i <= gt) {
      if (arr[i] < pivot) {
        const t = arr[lt]; arr[lt] = arr[i]; arr[i] = t;
        lt++;
        i++;
      } else if (arr[i] > pivot) {
        const t = arr[i]; arr[i] = arr[gt]; arr[gt] = t;
        gt--;
      } else {
        i++;
      }
    }
    if (lt - lo < hi - gt) {
      quickSort(arr, lo, lt - 1);
      lo = gt + 1;
    } else {
      quickSort(arr, gt + 1, hi);
      hi = lt - 1;
    }
  }
  return arr;
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
// 1. High-duplicate array (50,000 elements, 95% equal to 200) that overflows Lomuto
const dup = new Array(50000);
for (let i = 0; i < dup.length; i++) {
  dup[i] = (i % 20 === 0) ? (i % 5) * 100 : 200;
}
const expected = dup.slice().sort((a, b) => a - b);
const t0 = Date.now();
quickSort(dup);
const elapsed = Date.now() - t0;
for (let i = 0; i < dup.length; i++) {
  if (dup[i] !== expected[i]) assert.fail('Mismatch at index ' + i);
}
// 2. Already sorted array of 20,000 elements
const sorted = Array.from({ length: 20000 }, (_, i) => i);
quickSort(sorted);
assert.strictEqual(sorted[0], 0);
assert.strictEqual(sorted[19999], 19999);
assert(elapsed < 200, 'Expected fast 3-way sort under 200ms, took ' + elapsed + 'ms');
console.log('PASS');`
      }
    },

    // =========================================================================
    // 5. Binary Search Infinite Loop & 32-Bit Midpoint Overflow
    // =========================================================================
    {
      id: 'chal-05-binary-search-overflow-hang',
      title: 'Time-Series Index Hang: Binary Search Infinite Loop & Signed 32-Bit Overflow',
      subtitle: 'Boundary queries on a 1.2-billion-point time-series segment either return negative array indices ((lo + hi) >> 1 overflow) or hang in an infinite 2-element loop.',
      summary: 'Enforce a half-open interval invariant [lo, hi) with unsigned midpoint calculation lo + ((hi - lo) >>> 1) and strict monotonic interval shrinkage.',
      severity: 'SEV-1',
      difficulty: 'easy',
      category: 'Binary Search & Boundary Invariants',
      trackId: 'track-2',
      xp: 175,
      estimatedMinutes: 15,
      relatedSlugs: [
        'binary-search-boundary-invariants',
        'parametric-search-answer-space',
        'case-git-bisect-eytzinger'
      ],
      symptoms: [
        'Querying timestamps in the upper half of a 1.2-billion-entry memory-mapped array crashes with TypeError: Cannot read properties of undefined (index -1048576000).',
        'Last-less-than-or-equal (upper_bound - 1) queries hang forever at 100% CPU when hi === lo + 1.',
        'Bug reproduces deterministically whenever lo + hi >= 2,147,483,648 (2^31) or when searching for a key between two adjacent elements.'
      ],
      metricsAndLogs: {
        errorRate: '48.5%',
        latencyP99: '30,000ms',
        downstreamCpu: '100.0%',
        effectiveRps: 95,
        baselineRps: 18000,
        timeseries: [
          { time: '11:20:00', cpu: 20, latencyP99: 1.1, errorRate: 0.0, rps: 17900 },
          { time: '11:21:00', cpu: 88, latencyP99: 15000, errorRate: 29.0, rps: 1200 },
          { time: '11:22:00', cpu: 100, latencyP99: '30,000', errorRate: 48.5, rps: 95 }
        ],
        logs: [
          { timestamp: '11:20:42.310', level: 'ERROR', service: 'tsdb-index', message: 'Signed 32-bit shift overflow: (1100000000 + 1200000000) >> 1 evaluated to -997483648.' },
          { timestamp: '11:21:15.002', level: 'WARN', service: 'tsdb-index', message: 'Worker thread 4 stuck in findLastAtOrBefore(lo=4012, hi=4013): mid=4012, lo=mid never advances!' },
          { timestamp: '11:22:00.000', level: 'FATAL', service: 'tsdb-supervisor', message: 'Killed 8 hung query threads after 30s timeout in binarySearch.' }
        ]
      },
      slaImpact: '48.5% of time-range queries on large shards crash or hang worker threads indefinitely.',
      rootCauses: [
        {
          id: 'rc-midpoint-and-floor-bias',
          description: 'Signed bitwise shift (lo + hi) >> 1 overflows 32-bit signed integers when lo + hi >= 2^31, and updating lo = mid with floor division leaves [lo, hi] unchanged when hi = lo + 1.',
          correct: true,
          feedback: 'Spot on! In JavaScript, >> 1 coerces to a signed 32-bit integer (wrapping negative at 2^31), and lo = mid with floor rounding traps [lo, lo + 1] in an infinite loop.'
        },
        {
          id: 'rc-float-precision',
          description: 'IEEE-754 double-precision floats lose integer precision above 2^30.',
          correct: false,
          feedback: 'Incorrect. IEEE-754 doubles have 53 bits of significand precision (exact up to 9 × 10^15); it is the bitwise >> 1 operator that truncates to signed 32-bit.'
        },
        {
          id: 'rc-unsorted-timestamps',
          description: 'Incoming timestamps are out of order due to NTP clock skew.',
          correct: false,
          feedback: 'Incorrect. Even on strictly sorted data, lo = mid with floor midpoint loops forever on any 2-element interval where arr[lo] <= target < arr[hi].'
        },
        {
          id: 'rc-eytzinger-alignment',
          description: 'Memory-mapped Float64Array is not aligned to 64-byte cache lines.',
          correct: false,
          feedback: 'Incorrect. Cache alignment affects latency by nanoseconds, not infinite loops or negative indices.'
        }
      ],
      invariants: [
        'Overflow-safe midpoint: mid = lo + Math.floor((hi - lo) / 2) (or lo + ((hi - lo) >>> 1) for 32-bit unsigned ranges) never exceeds hi.',
        'Half-open lower_bound / upper_bound on [lo, hi): sincelo < hi implies lo <= mid < hi, setting lo = mid + 1 or hi = mid strictly reduces (hi - lo) on every iteration.',
        'To find the last element <= target, find upperBound(target) (first index > target) and return idx - 1.'
      ],
      interactiveTuning: [
        {
          id: 'midpointFormula',
          label: 'Midpoint Calculation Formula',
          type: 'select',
          options: ['signed-shift-lo-plus-hi', 'unsigned-diff-lo-plus-half-span'],
          defaultValue: 'signed-shift-lo-plus-hi',
          description: 'Arithmetic expression used to compute the midpoint index.'
        },
        {
          id: 'intervalConvention',
          label: 'Search Interval Invariant',
          type: 'select',
          options: ['closed-inclusive-lo-equal-mid', 'half-open-lo-mid-plus-1-hi-mid'],
          defaultValue: 'closed-inclusive-lo-equal-mid',
          description: 'Boundary update rule guaranteeing strict interval shrinkage every step.'
        },
        {
          id: 'memoryLayout',
          label: 'Static Index Layout',
          type: 'select',
          options: ['sorted-array', 'eytzinger-bfs-layout'],
          defaultValue: 'sorted-array',
          description: 'Array layout for cache-line prefetch efficiency.'
        },
        {
          id: 'branchlessSelect',
          label: 'Loop Branching Mode',
          type: 'select',
          options: ['standard-if-else', 'cmov-branchless'],
          defaultValue: 'standard-if-else',
          description: 'Eliminate branch misprediction penalties during binary search.'
        }
      ],
      optimalPreset: {
        midpointFormula: 'unsigned-diff-lo-plus-half-span',
        intervalConvention: 'half-open-lo-mid-plus-1-hi-mid',
        memoryLayout: 'eytzinger-bfs-layout',
        branchlessSelect: 'cmov-branchless'
      },
      verify: function(knobs) {
        var safeMid = knobs.midpointFormula === 'unsigned-diff-lo-plus-half-span';
        var safeLoop = knobs.intervalConvention === 'half-open-lo-mid-plus-1-hi-mid';
        var ok = safeMid && safeLoop;
        return {
          success: ok,
          message: ok
            ? 'Index stabilized! Half-open interval [lo, hi) with overflow-safe lo + Math.floor((hi - lo) / 2) eliminated all infinite loops and 32-bit sign overflows.'
            : 'Binary search is still vulnerable to midpoint overflow or 2-element infinite loops. Select unsigned-diff-lo-plus-half-span and half-open-lo-mid-plus-1-hi-mid.',
          metrics: {
            latencyP99: ok ? '0.4ms' : '30,000ms',
            errorRate: ok ? '0.00%' : '48.5%',
            downstreamCpu: ok ? '11.2%' : '100.0%',
            effectiveRps: ok ? 18000 : 95
          }
        };
      },
      codeFix: {
        title: 'Fix Binary Search Midpoint Overflow & Infinite Boundary Loop',
        summary: 'Rewrite findLastAtOrBefore(arr, target) using a half-open interval [lo, hi) with overflow-safe midpoint lo + Math.floor((hi - lo) / 2) so it terminates in O(log N) on all inputs.',
        buggyCode: `function findLastAtOrBefore(arr, target, lo = 0, hi = arr.length - 1) {
  if (arr.length === 0 || arr[lo] > target) return -1;
  while (lo < hi) {
    // BUG 1: (lo + hi) >> 1 overflows signed 32-bit int when lo + hi >= 2^31!
    // BUG 2: Floor division with lo = mid loops forever when hi === lo + 1!
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= target) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}`,
        solutionCode: `function findLastAtOrBefore(arr, target, lo = 0, hi = arr.length - 1) {
  if (hi < lo) return -1;
  let left = lo;
  let right = hi + 1; // half-open [left, right) searching for first > target
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left - 1 >= lo ? left - 1 : -1;
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
// 1. Test 2-element boundary that caused an infinite loop in the buggy code
const a = [10, 20, 30, 40, 50];
assert.strictEqual(findLastAtOrBefore(a, 5), -1);
assert.strictEqual(findLastAtOrBefore(a, 10), 0);
assert.strictEqual(findLastAtOrBefore(a, 15), 0);
assert.strictEqual(findLastAtOrBefore(a, 20), 1);
assert.strictEqual(findLastAtOrBefore(a, 25), 1);
assert.strictEqual(findLastAtOrBefore(a, 50), 4);
assert.strictEqual(findLastAtOrBefore(a, 99), 4);

// 2. Test virtual sparse array with indices > 2^30 where (lo + hi) >= 2^31 overflows >> 1
const virtualArr = new Proxy({}, {
  get(_, prop) {
    if (prop === 'length') return 1600000000;
    const idx = Number(prop);
    return idx * 10;
  }
});
const idx = findLastAtOrBefore(virtualArr, 12000000055, 1100000000, 1500000000);
assert.strictEqual(idx, 1200000005);
console.log('PASS');`
      }
    },

    // =========================================================================
    // 6. Monotonic Key Skew in Unbalanced BST Index (LLRB Rotations)
    // =========================================================================
    {
      id: 'chal-06-unbalanced-bst-skew',
      title: 'Order-Book Index Degradation: Monotonic Key Insertion Skewing BST to O(N)',
      subtitle: 'Inserting chronologically increasing order IDs into an unbalanced Binary Search Tree degenerates tree height to H = N, turning O(log N) rank queries into O(N) linked-list walks.',
      summary: 'Enforce Left-Leaning Red-Black (LLRB) invariants (rotateLeft, rotateRight, flipColors) with subtree size augmentation so height is strictly bounded by 2 log₂(N + 1).',
      severity: 'SEV-1',
      difficulty: 'hard',
      category: 'Self-Balancing & Order-Statistic Trees',
      trackId: 'track-3',
      xp: 250,
      estimatedMinutes: 25,
      relatedSlugs: [
        'bst-operations-hibbard-deletion',
        'red-black-llrb-isomorphism',
        'build-llrb-order-statistic-tree'
      ],
      symptoms: [
        'Order-book rank() and rangeCount() queries start at 3 microseconds after market open, then degrade linearly over 20 minutes to 42 milliseconds per query.',
        'Tree diagnostics report nodeCount = 85,000 and maxDepth = 85,000 (0 left children across the entire spine).',
        'Replaying the exact same 85,000 orders in shuffled order runs 1,800× faster than chronological market replay.'
      ],
      metricsAndLogs: {
        errorRate: '31.2%',
        latencyP99: '420ms',
        downstreamCpu: '99.4%',
        effectiveRps: 210,
        baselineRps: 35000,
        timeseries: [
          { time: '09:30:00', cpu: 12, latencyP99: 0.3, errorRate: 0.0, rps: 34800 },
          { time: '09:35:00', cpu: 58, latencyP99: 28.0, errorRate: 1.4, rps: 14200 },
          { time: '09:40:00', cpu: 99, latencyP99: 420.0, errorRate: 31.2, rps: 210 }
        ],
        logs: [
          { timestamp: '09:34:10.118', level: 'WARN', service: 'matching-engine', message: 'BST height reached 25,000 (expected <= 30 for N=25,000). Right-spine skew = 100%.' },
          { timestamp: '09:38:52.409', level: 'ERROR', service: 'matching-engine', message: 'rank(orderId=100084992) traversed 84,992 right pointers in 41.8ms.' },
          { timestamp: '09:40:01.003', level: 'FATAL', service: 'risk-gateway', message: 'Matching engine heartbeat missed; halting symbol partition.' }
        ]
      },
      slaImpact: 'Matching engine p99 latency breaches 1ms SLA within 90 seconds of monotonic order ID ingestion.',
      rootCauses: [
        {
          id: 'rc-monotonic-bst-skew',
          description: 'An unbalanced BST has expected height O(log N) only on random permutations; monotonic insertions append exclusively to the right spine, creating a degenerate O(N) linked list.',
          correct: true,
          feedback: 'Exact match! Monotonic timestamps or auto-incrementing IDs are the worst-case adversarial input for an unbalanced BST, requiring self-balancing rotations (LLRB/AVL/Treap).'
        },
        {
          id: 'rc-hibbard-deletion',
          description: 'Hibbard successor deletion is causing √N height degradation.',
          correct: false,
          feedback: 'Incorrect. Hibbard deletion asymmetry degrades height to Θ(√N) over millions of random insert/delete pairs, whereas here height is N = 85,000 purely from monotonic insertions.'
        },
        {
          id: 'rc-pointer-compression',
          description: '64-bit object pointers are overflowing L1 instruction cache.',
          correct: false,
          feedback: 'Incorrect. The issue is traversing 85,000 nodes per query instead of 17 nodes.'
        },
        {
          id: 'rc-subtree-size-recalc',
          description: 'Subtree size is being recomputed via O(N) DFS on each insert.',
          correct: false,
          feedback: 'Incorrect. Even O(1) size updates along the insertion path take O(H) = O(N) when tree height H equals N.'
        }
      ],
      invariants: [
        'Sedgewick Left-Leaning Red-Black (LLRB) trees encode 2-3 trees via three bottom-up fixup operations on the return path: rotateLeft if right is red and left is black; rotateRight if left and left.left are both red; flipColors if both children are red.',
        'Every path from the root to a null link contains the exact same number of black links (perfect black balance), and no two red links appear consecutively, bounding height H <= 2 log₂(N + 1).',
        'Every rotation updates augmented subtree sizes in O(1): x.size = node.size; node.size = 1 + size(node.left) + size(node.right).'
      ],
      interactiveTuning: [
        {
          id: 'treeBalancing',
          label: 'Tree Balancing Invariant',
          type: 'select',
          options: ['unbalanced-naive-bst', 'left-leaning-red-black-llrb', 'avl-height-balanced'],
          defaultValue: 'unbalanced-naive-bst',
          description: 'Self-balancing rotation mechanism enforcing O(log N) worst-case height.'
        },
        {
          id: 'sizeAugmentation',
          label: 'Order-Statistic Augmentation',
          type: 'select',
          options: ['full-inorder-walk-o-n', 'o1-maintained-subtree-size'],
          defaultValue: 'full-inorder-walk-o-n',
          description: 'Maintain node.size = 1 + size(left) + size(right) across rotations for O(log N) rank().'
        },
        {
          id: 'rotationInsertStyle',
          label: 'Insertion Implementation',
          type: 'select',
          options: ['unbounded-recursion', 'bottom-up-llrb-fixup'],
          defaultValue: 'unbounded-recursion',
          description: 'Apply local 3-line LLRB rotations on the unwind path.'
        },
        {
          id: 'nodePoolPrealloc',
          label: 'Node Allocation Strategy',
          type: 'range',
          min: 0,
          max: 100000,
          step: 25000,
          defaultValue: 0,
          unit: 'nodes',
          description: 'Pre-allocated node pool capacity to avoid GC pauses during market open.'
        }
      ],
      optimalPreset: {
        treeBalancing: 'left-leaning-red-black-llrb',
        sizeAugmentation: 'o1-maintained-subtree-size',
        rotationInsertStyle: 'bottom-up-llrb-fixup',
        nodePoolPrealloc: 100000
      },
      verify: function(knobs) {
        var isBalanced = knobs.treeBalancing === 'left-leaning-red-black-llrb' || knobs.treeBalancing === 'avl-height-balanced';
        var isAugmented = knobs.sizeAugmentation === 'o1-maintained-subtree-size';
        var isFixup = knobs.rotationInsertStyle === 'bottom-up-llrb-fixup';
        var ok = isBalanced && isAugmented && isFixup;
        return {
          success: ok,
          message: ok
            ? 'Order-book index recovered! LLRB rotations capped tree height at 17 for 85,000 monotonic orders, restoring O(log N) rank() and 0.28ms P99 latency.'
            : 'Tree height or rank() computation is still O(N) on monotonic inputs. Select left-leaning-red-black-llrb, o1-maintained-subtree-size, and bottom-up-llrb-fixup.',
          metrics: {
            latencyP99: ok ? '0.28ms' : '420ms',
            errorRate: ok ? '0.00%' : '31.2%',
            downstreamCpu: ok ? '14.8%' : '99.4%',
            effectiveRps: ok ? 35000 : 210
          }
        };
      },
      codeFix: {
        title: 'Upgrade Unbalanced BST to Left-Leaning Red-Black (LLRB) Order-Statistic Tree',
        summary: 'Add LLRB rotations (_rotateLeft, _rotateRight, _flipColors) and subtree size maintenance so inserting 20,000 monotonic keys keeps height <= 2 log2(N) and rank(key) runs in O(log N).',
        buggyCode: `class OrderStatisticTree {
  constructor() {
    this.root = null;
  }
  _size(n) { return n ? n.size : 0; }
  insert(key) {
    this.root = this._insert(this.root, key);
  }
  _insert(h, key) {
    if (!h) return { key, left: null, right: null, size: 1, red: true };
    // BUG: No rotations! Monotonic keys create a degenerate O(N) right-skewed chain!
    if (key < h.key) h.left = this._insert(h.left, key);
    else if (key > h.key) h.right = this._insert(h.right, key);
    h.size = 1 + this._size(h.left) + this._size(h.right);
    return h;
  }
  rank(key) {
    let curr = this.root, r = 0;
    while (curr) {
      if (key < curr.key) curr = curr.left;
      else if (key > curr.key) {
        r += 1 + this._size(curr.left);
        curr = curr.right;
      } else {
        return r + this._size(curr.left);
      }
    }
    return r;
  }
  height(n = this.root) {
    if (!n) return 0;
    return 1 + Math.max(this.height(n.left), this.height(n.right));
  }
}`,
        solutionCode: `class OrderStatisticTree {
  constructor() {
    this.root = null;
  }
  _isRed(n) { return Boolean(n && n.red); }
  _size(n) { return n ? n.size : 0; }
  _rotateLeft(h) {
    const x = h.right;
    h.right = x.left;
    x.left = h;
    x.red = h.red;
    h.red = true;
    x.size = h.size;
    h.size = 1 + this._size(h.left) + this._size(h.right);
    return x;
  }
  _rotateRight(h) {
    const x = h.left;
    h.left = x.right;
    x.right = h;
    x.red = h.red;
    h.red = true;
    x.size = h.size;
    h.size = 1 + this._size(h.left) + this._size(h.right);
    return x;
  }
  _flipColors(h) {
    h.red = !h.red;
    h.left.red = !h.left.red;
    h.right.red = !h.right.red;
  }
  insert(key) {
    this.root = this._insert(this.root, key);
    this.root.red = false;
  }
  _insert(h, key) {
    if (!h) return { key, left: null, right: null, size: 1, red: true };
    if (key < h.key) h.left = this._insert(h.left, key);
    else if (key > h.key) h.right = this._insert(h.right, key);

    if (this._isRed(h.right) && !this._isRed(h.left)) h = this._rotateLeft(h);
    if (this._isRed(h.left) && this._isRed(h.left.left)) h = this._rotateRight(h);
    if (this._isRed(h.left) && this._isRed(h.right)) this._flipColors(h);

    h.size = 1 + this._size(h.left) + this._size(h.right);
    return h;
  }
  rank(key) {
    let curr = this.root, r = 0;
    while (curr) {
      if (key < curr.key) curr = curr.left;
      else if (key > curr.key) {
        r += 1 + this._size(curr.left);
        curr = curr.right;
      } else {
        return r + this._size(curr.left);
      }
    }
    return r;
  }
  height(n = this.root) {
    if (!n) return 0;
    return 1 + Math.max(this.height(n.left), this.height(n.right));
  }
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
const tree = new OrderStatisticTree();
const N = 15000;
// Insert 15,000 strictly increasing keys (would cause stack overflow & height=15000 in unbalanced BST)
for (let i = 0; i < N; i++) {
  tree.insert(i * 10);
}
const h = tree.height();
assert(h <= 28, 'Expected LLRB height <= 28 for N=15000, got ' + h);
for (let i = 0; i < N; i += 500) {
  assert.strictEqual(tree.rank(i * 10), i);
  assert.strictEqual(tree.rank(i * 10 + 5), i + 1);
}
console.log('PASS');`
      }
    },

    // =========================================================================
    // 7. Segment Tree Unlazied Range Update Cascade & Length Scaling Bug
    // =========================================================================
    {
      id: 'chal-07-segment-tree-lazy-push-bug',
      title: 'Billing Aggregator Corruption & TLE: Segment Tree Missing Lazy Propagation',
      subtitle: 'Range-add billing adjustments recurse all the way to N leaves (O(N) per update) and fail to multiply lazy tags by segment width (r - l + 1).',
      summary: 'Terminate range updates on full cover (ql <= l && r <= qr) in O(log N) time and scale lazy additive deltas by interval length (r - l + 1).',
      severity: 'SEV-1',
      difficulty: 'hard',
      category: 'Range Queries & Lazy Segment Trees',
      trackId: 'track-3',
      xp: 250,
      estimatedMinutes: 25,
      relatedSlugs: [
        'lazy-propagation-segment-tree-beats',
        'segment-trees-bottom-up-monoids',
        'build-lazy-segment-tree'
      ],
      symptoms: [
        'Applying 50,000 promotional credit range adjustments across 100,000 billing buckets times out after 18.4 seconds.',
        'Range-sum reconciliation checks fail by factors of 2× to 65,536× on internal segment tree nodes.',
        'Profiling shows rangeAdd() visiting 199,999 tree nodes per full-range update instead of O(log N) <= 68 nodes.'
      ],
      metricsAndLogs: {
        errorRate: '100.0%',
        latencyP99: '18,400ms',
        downstreamCpu: '100.0%',
        effectiveRps: 3,
        baselineRps: 4000,
        timeseries: [
          { time: '16:00:00', cpu: 19, latencyP99: 2.1, errorRate: 0.0, rps: 3980 },
          { time: '16:01:00', cpu: 100, latencyP99: 18400, errorRate: 100.0, rps: 3 }
        ],
        logs: [
          { timestamp: '16:00:14.220', level: 'WARN', service: 'billing-rollup', message: 'rangeAdd(0, 99999, +50) visited 199,999 segment tree nodes (lazy stop condition missing).' },
          { timestamp: '16:00:39.811', level: 'ERROR', service: 'billing-rollup', message: 'Reconciliation mismatch on [0..63]: expected sum +3,200, got +50 (missing *(r-l+1) length factor).' },
          { timestamp: '16:01:00.004', level: 'FATAL', service: 'billing-rollup', message: 'Batch settlement aborted: ledger invariant violation and 18.4s execution timeout.' }
        ]
      },
      slaImpact: 'Hourly billing settlement fails ledger reconciliation and exceeds batch execution window by 30×.',
      rootCauses: [
        {
          id: 'rc-missing-lazy-stop-and-len',
          description: 'rangeAdd recurses to leaves even when [l, r] is fully inside [ql, qr] (turning O(log N) into O(N)), and applies +delta instead of +delta * (r - l + 1) to segment sums.',
          correct: true,
          feedback: 'Exact diagnosis! A range-sum segment tree must halt recursion at canonical covering nodes (<= 4 log N nodes) and scale additive updates by the number of leaves (r - l + 1) in that node.'
        },
        {
          id: 'rc-4n-array-size',
          description: 'Allocating 2N instead of 4N array elements causes out-of-bounds corruption.',
          correct: false,
          feedback: 'Incorrect. The tree array is already sized at 4N; the bug is in lazy propagation and interval-length scaling.'
        },
        {
          id: 'rc-fenwick-only',
          description: 'Segment trees cannot support range updates and range sums simultaneously.',
          correct: false,
          feedback: 'Incorrect. Lazy propagation over the affine/additive monoid supports both range-add and range-sum in O(log N).'
        },
        {
          id: 'rc-float-rounding',
          description: 'Integer cents overflow 53-bit JavaScript Numbers.',
          correct: false,
          feedback: 'Incorrect. Totals are well under 2^53; the error is omitting multiplication by segment length (r - l + 1).'
        }
      ],
      invariants: [
        'Canonical covering property: any interval [ql, qr] is partitioned into at most 2 log₂ N maximal segment tree nodes where ql <= l && r <= qr.',
        'Additive monoid homomorphism: adding delta to every element in [l, r] increases sum[node] by delta * (r - l + 1) and increments lazy[node] by delta.',
        'Before visiting children of node v in either rangeAdd or rangeSum, pushDown(v, l, r) propagates lazy[v] to children 2v and 2v+1 and resets lazy[v] = 0.'
      ],
      interactiveTuning: [
        {
          id: 'updatePropagation',
          label: 'Range Update Termination Strategy',
          type: 'select',
          options: ['recurse-to-all-leaves-o-n', 'lazy-tag-stop-on-full-cover'],
          defaultValue: 'recurse-to-all-leaves-o-n',
          description: 'Stop recursion immediately when [l, r] is completely contained inside [ql, qr].'
        },
        {
          id: 'sumAggregationFormula',
          label: 'Node Sum Update Rule',
          type: 'select',
          options: ['unscaled-add-delta', 'length-scaled-delta-times-span'],
          defaultValue: 'unscaled-add-delta',
          description: 'Scale additive tag by segment width (r - l + 1) when updating sum[node].'
        },
        {
          id: 'pushDownTiming',
          label: 'Lazy Tag Push-Down Discipline',
          type: 'select',
          options: ['never-push-down', 'push-before-partial-child-descent'],
          defaultValue: 'never-push-down',
          description: 'Propagate pending lazy tags to left/right children before descending.'
        },
        {
          id: 'backingStorage',
          label: 'Tree Backing Array Type',
          type: 'select',
          options: ['boxed-js-array', 'flat-float64-typed-array'],
          defaultValue: 'boxed-js-array',
          description: 'Contiguous 4N TypedArray layout for unboxed arithmetic.'
        }
      ],
      optimalPreset: {
        updatePropagation: 'lazy-tag-stop-on-full-cover',
        sumAggregationFormula: 'length-scaled-delta-times-span',
        pushDownTiming: 'push-before-partial-child-descent',
        backingStorage: 'flat-float64-typed-array'
      },
      verify: function(knobs) {
        var isLazy = knobs.updatePropagation === 'lazy-tag-stop-on-full-cover';
        var isScaled = knobs.sumAggregationFormula === 'length-scaled-delta-times-span';
        var isPush = knobs.pushDownTiming === 'push-before-partial-child-descent';
        var ok = isLazy && isScaled && isPush;
        return {
          success: ok,
          message: ok
            ? 'Billing ledger verified! O(log N) lazy propagation with (r - l + 1) span scaling processed 50,000 range updates and queries in 11.2ms with 100% reconciliation accuracy.'
            : 'Segment tree still suffers from O(N) leaf recursion or unscaled range sums. Select lazy-tag-stop-on-full-cover, length-scaled-delta-times-span, and push-before-partial-child-descent.',
          metrics: {
            latencyP99: ok ? '11.2ms' : '18,400ms',
            errorRate: ok ? '0.00%' : '100.0%',
            downstreamCpu: ok ? '18.0%' : '100.0%',
            effectiveRps: ok ? 4000 : 3
          }
        };
      },
      codeFix: {
        title: 'Fix Lazy Segment Tree Range-Add & Span-Length Scaling',
        summary: 'Implement _apply(node, l, r, delta) multiplying delta by (r - l + 1) and _pushDown(node, l, r) so both rangeAdd and rangeSum run in O(log N) time.',
        buggyCode: `class LazySegmentTree {
  constructor(n) {
    this.n = n;
    this.sum = new Float64Array(4 * n);
    this.lazy = new Float64Array(4 * n);
  }
  rangeAdd(ql, qr, delta, node = 1, l = 0, r = this.n - 1) {
    if (qr < l || r < ql) return;
    // BUG 1: Recurses all the way to l === r (O(N) per rangeAdd!)
    // BUG 2: Forgets to multiply delta by segment length (r - l + 1)!
    if (l === r) {
      this.sum[node] += delta;
      return;
    }
    const mid = (l + r) >> 1;
    this.rangeAdd(ql, qr, delta, node * 2, l, mid);
    this.rangeAdd(ql, qr, delta, node * 2 + 1, mid + 1, r);
    this.sum[node] = this.sum[node * 2] + this.sum[node * 2 + 1];
  }
  rangeSum(ql, qr, node = 1, l = 0, r = this.n - 1) {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return this.sum[node];
    const mid = (l + r) >> 1;
    return this.rangeSum(ql, qr, node * 2, l, mid) +
           this.rangeSum(ql, qr, node * 2 + 1, mid + 1, r);
  }
}`,
        solutionCode: `class LazySegmentTree {
  constructor(n) {
    this.n = n;
    this.sum = new Float64Array(4 * n);
    this.lazy = new Float64Array(4 * n);
  }
  _apply(node, l, r, delta) {
    this.sum[node] += delta * (r - l + 1);
    this.lazy[node] += delta;
  }
  _pushDown(node, l, r) {
    const tag = this.lazy[node];
    if (tag !== 0) {
      const mid = (l + r) >> 1;
      this._apply(node * 2, l, mid, tag);
      this._apply(node * 2 + 1, mid + 1, r, tag);
      this.lazy[node] = 0;
    }
  }
  rangeAdd(ql, qr, delta, node = 1, l = 0, r = this.n - 1) {
    if (qr < l || r < ql) return;
    if (ql <= l && r <= qr) {
      this._apply(node, l, r, delta);
      return;
    }
    this._pushDown(node, l, r);
    const mid = (l + r) >> 1;
    this.rangeAdd(ql, qr, delta, node * 2, l, mid);
    this.rangeAdd(ql, qr, delta, node * 2 + 1, mid + 1, r);
    this.sum[node] = this.sum[node * 2] + this.sum[node * 2 + 1];
  }
  rangeSum(ql, qr, node = 1, l = 0, r = this.n - 1) {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return this.sum[node];
    this._pushDown(node, l, r);
    const mid = (l + r) >> 1;
    return this.rangeSum(ql, qr, node * 2, l, mid) +
           this.rangeSum(ql, qr, node * 2 + 1, mid + 1, r);
  }
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
const seg = new LazySegmentTree(8);
seg.rangeAdd(0, 7, 10); // [10,10,10,10,10,10,10,10]
assert.strictEqual(seg.rangeSum(0, 7), 80);
seg.rangeAdd(2, 5, 5);  // [10,10,15,15,15,15,10,10]
assert.strictEqual(seg.rangeSum(0, 3), 50);
assert.strictEqual(seg.rangeSum(2, 5), 60);
assert.strictEqual(seg.rangeSum(0, 7), 100);

// Performance test: 20,000 full-range updates on N=32,768
const big = new LazySegmentTree(32768);
const t0 = Date.now();
for (let i = 0; i < 20000; i++) {
  big.rangeAdd(100, 30000, 2);
}
assert.strictEqual(big.rangeSum(100, 30000), (30000 - 100 + 1) * 40000);
assert(Date.now() - t0 < 250, 'Expected O(log N) lazy updates');
console.log('PASS');`
      }
    },

    // =========================================================================
    // 8. Catastrophic ReDoS Backtracking vs Thompson NFA
    // =========================================================================
    {
      id: 'chal-08-redos-catastrophic-backtracking',
      title: 'WAF Filter Outage: Catastrophic O(2^N) ReDoS Backtracking on Nested Quantifiers',
      subtitle: 'A 32-character non-matching HTTP header ("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!") locks up the recursive regex validator in 2^32 backtracking branches.',
      summary: 'Replace exponential DFS backtracking with lock-step Thompson NFA active-state-set simulation (or deduplicated state memoization) to guarantee O(N · M) linear time.',
      severity: 'SEV-1',
      difficulty: 'hard',
      category: 'Automata & Regular Expression Engines',
      trackId: 'track-4',
      xp: 275,
      estimatedMinutes: 25,
      relatedSlugs: [
        'thompson-nfa-vs-backtracking-regex',
        'build-thompson-nfa-regex-engine',
        'aho-corasick-trie-automaton'
      ],
      symptoms: [
        'Single HTTP request with header X-Token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaa!" freezes the edge proxy worker for 28+ seconds.',
        'Increasing input length by 1 character ("a") strictly doubles CPU execution time (t(26) = 350ms, t(27) = 700ms, t(28) = 1,400ms).',
        'CPU profiler shows matchStar() calling itself recursively millions of times on the same (stateId, textIndex) pair.'
      ],
      metricsAndLogs: {
        errorRate: '79.0%',
        latencyP99: '28,500ms',
        downstreamCpu: '100.0%',
        effectiveRps: 4,
        baselineRps: 22000,
        timeseries: [
          { time: '19:00:00', cpu: 14, latencyP99: 0.9, errorRate: 0.0, rps: 21800 },
          { time: '19:01:00', cpu: 100, latencyP99: 28500, errorRate: 79.0, rps: 4 }
        ],
        logs: [
          { timestamp: '19:00:18.412', level: 'WARN', service: 'waf-validator', message: 'Regex evaluation on 28-byte token exceeded 16,777,216 backtracking steps.' },
          { timestamp: '19:00:46.901', level: 'ERROR', service: 'waf-validator', message: 'ReDoS signature detected: nested quantifier (a+)+ evaluated via unmemoized DFS.' },
          { timestamp: '19:01:00.002', level: 'FATAL', service: 'edge-router', message: 'All 16 WAF worker threads deadlocked at 100% CPU; shedding 79% of ingress traffic.' }
        ]
      },
      slaImpact: 'A single 32-byte payload causes complete denial of service across edge WAF workers (Regular Expression Denial of Service).',
      rootCauses: [
        {
          id: 'rc-exponential-backtracking',
          description: 'Recursive backtracking explores all 2^(N-1) compositions of N identical characters across nested quantifiers (a+)+ without deduplicating (state, index) pairs.',
          correct: true,
          feedback: 'Spot on! There are 2^(N-1) ways to partition "a"^N into non-empty runs of (a+)+. Thompson NFA lock-step simulation tracks the set of active NFA states at index i, bounding work to at most |S| states per character: O(N · M)!'
        },
        {
          id: 'rc-utf8-decoding',
          description: 'UTF-8 multi-byte surrogate pair decoding takes quadratic time.',
          correct: false,
          feedback: 'Incorrect. The payload is 32 ASCII bytes; the doubling per character is classic O(2^N) backtracking.'
        },
        {
          id: 'rc-dfa-state-blowup',
          description: 'Pre-compiling the DFA exhausted 64GB of RAM.',
          correct: false,
          feedback: 'Incorrect. The engine was using lazy recursive backtracking, not a DFA or Thompson NFA.'
        },
        {
          id: 'rc-regex-jit-warmup',
          description: 'V8 Irregexp JIT compilation takes 28 seconds to emit native machine code.',
          correct: false,
          feedback: 'Incorrect. Compilation takes microseconds; execution time doubles with each added character.'
        }
      ],
      invariants: [
        'Thompson NFA invariant: at string position i, an NFA with M states can be in at most M distinct states simultaneously, regardless of how many paths lead to each state.',
        'By maintaining a deduplicated active state set clist (via listId[state] === stepId stamp) and advancing lock-step to nlist on each character c, matching takes O(N · M) worst-case time.',
        'Equivalently, memoizing visited (state, pos) pairs in an NFA transitions the traversal from an exponential tree walk O(2^N) to a DAG walk of size O(N · M).'
      ],
      interactiveTuning: [
        {
          id: 'regexEngineType',
          label: 'Regex Execution Engine',
          type: 'select',
          options: ['recursive-dfs-backtracking', 'thompson-nfa-lockstep-set'],
          defaultValue: 'recursive-dfs-backtracking',
          description: 'Automaton simulation strategy for evaluating regular expressions.'
        },
        {
          id: 'epsilonClosureDedup',
          label: 'State Set Deduplication',
          type: 'select',
          options: ['none-allow-duplicate-states', 'step-counter-listid-dedup'],
          defaultValue: 'none-allow-duplicate-states',
          description: 'O(1) generation-counter check preventing duplicate states in clist/nlist.'
        },
        {
          id: 'quantifierRewrite',
          label: 'Nested Quantifier Lint Rule',
          type: 'select',
          options: ['allow-ambiguous-star-height', 'flatten-redundant-quantifiers'],
          defaultValue: 'allow-ambiguous-star-height',
          description: 'Static pattern check for star-height >= 2 expressions.'
        },
        {
          id: 'maxInputBytes',
          label: 'Max Header Token Length Guard',
          type: 'range',
          min: 256,
          max: 8192,
          step: 256,
          defaultValue: 4096,
          unit: 'bytes',
          description: 'Maximum token length passed to the automaton.'
        }
      ],
      optimalPreset: {
        regexEngineType: 'thompson-nfa-lockstep-set',
        epsilonClosureDedup: 'step-counter-listid-dedup',
        quantifierRewrite: 'flatten-redundant-quantifiers',
        maxInputBytes: 2048
      },
      verify: function(knobs) {
        var isThompson = knobs.regexEngineType === 'thompson-nfa-lockstep-set';
        var isDedup = knobs.epsilonClosureDedup === 'step-counter-listid-dedup';
        var ok = isThompson && isDedup;
        return {
          success: ok,
          message: ok
            ? 'ReDoS vulnerability eliminated! Thompson NFA lock-step state-set simulation with listId deduplication evaluated a 2,000-character adversarial payload in 0.14ms (strict O(N · M)).'
            : 'Regex engine can still explore exponential duplicate state paths. Select thompson-nfa-lockstep-set and step-counter-listid-dedup.',
          metrics: {
            latencyP99: ok ? '0.14ms' : '28,500ms',
            errorRate: ok ? '0.00%' : '79.0%',
            downstreamCpu: ok ? '9.2%' : '100.0%',
            effectiveRps: ok ? 22000 : 4
          }
        };
      },
      codeFix: {
        title: 'Replace Exponential NFA Backtracking with Lock-Step Thompson State-Set Simulation',
        summary: 'Eliminate O(2^N) ReDoS backtracking on ambiguous NFA transitions by simulating deduplicated active state sets (or memoized (state, idx) states) in O(N · M) time.',
        buggyCode: `// Ambiguous NFA for /^(a+)+$/ represented as state transitions:
// State 0: epsilon -> 1
// State 1: 'a' -> 2
// State 2: epsilon -> 1 (inner + loop), epsilon -> 0 (outer + loop), epsilon -> 3 (accept)
function matchAmbiguousNfa(input) {
  function dfs(state, idx) {
    // BUG: Exponential O(2^N) unmemoized backtracking across inner & outer epsilon loops!
    if (state === 0) return dfs(1, idx);
    if (state === 1) {
      if (idx < input.length && input[idx] === 'a') return dfs(2, idx + 1);
      return false;
    }
    if (state === 2) {
      if (dfs(1, idx)) return true; // inner loop
      if (dfs(0, idx)) return true; // outer loop
      if (dfs(3, idx)) return true; // exit to accept
      return false;
    }
    if (state === 3) return idx === input.length;
    return false;
  }
  return dfs(0, 0);
}`,
        solutionCode: `// Thompson lock-step NFA simulation over states {0, 1, 2, 3}
// Epsilon closure of {0, 1} = {0, 1}; Epsilon closure of {2} = {0, 1, 2, 3}
function matchAmbiguousNfa(input) {
  function epsilonClosure(states) {
    const out = new Set(states);
    const stack = Array.from(states);
    while (stack.length > 0) {
      const s = stack.pop();
      const eps = s === 0 ? [1] : (s === 2 ? [1, 0, 3] : []);
      for (const next of eps) {
        if (!out.has(next)) {
          out.add(next);
          stack.push(next);
        }
      }
    }
    return out;
  }

  let currentStates = epsilonClosure([0]);
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const nextRaw = [];
    if (ch === 'a' && currentStates.has(1)) {
      nextRaw.push(2);
    }
    currentStates = epsilonClosure(nextRaw);
    if (currentStates.size === 0) return false;
  }
  return currentStates.has(3);
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
assert.strictEqual(matchAmbiguousNfa('a'), true);
assert.strictEqual(matchAmbiguousNfa('aaaa'), true);
assert.strictEqual(matchAmbiguousNfa(''), false);
assert.strictEqual(matchAmbiguousNfa('ab'), false);

// Adversarial ReDoS payload of 2,000 'a's followed by '!' (2^2000 paths in backtracking, O(N) in Thompson NFA)
const redosPayload = 'a'.repeat(2000) + '!';
const t0 = Date.now();
assert.strictEqual(matchAmbiguousNfa(redosPayload), false);
assert.strictEqual(matchAmbiguousNfa('a'.repeat(2000)), true);
const elapsed = Date.now() - t0;
assert(elapsed < 100, 'Expected linear Thompson NFA under 100ms, took ' + elapsed + 'ms');
console.log('PASS');`
      }
    },

    // =========================================================================
    // 9. Multi-Pattern Scanner O(N * K) Timeout vs Aho-Corasick Automaton
    // =========================================================================
    {
      id: 'chal-09-rabin-karp-spurious-collisions',
      title: 'DLP Content Scanner TLE: O(N · K) Naive Multi-Pattern Loop vs Aho-Corasick',
      subtitle: 'Scanning 5MB documents against K = 2,500 sensitive-token signatures via K separate string searches saturates CPU cores and misses overlapping matches.',
      summary: 'Compile all K patterns into a single Aho-Corasick trie automaton with BFS failure links and dictionary suffix links to scan text in a single O(N + M + Z) pass.',
      severity: 'SEV-2',
      difficulty: 'hard',
      category: 'Multi-Pattern String Automata',
      trackId: 'track-4',
      xp: 250,
      estimatedMinutes: 25,
      relatedSlugs: [
        'aho-corasick-trie-automaton',
        'rabin-karp-polynomial-rolling-hash',
        'build-aho-corasick-scanner'
      ],
      symptoms: [
        'Adding 2,000 new threat signatures increased document inspection latency linearly from 12ms to 3,400ms per document.',
        'L2/L3 cache miss rate spiked because each document is streamed through CPU cache 2,500 separate times (once per pattern).',
        'Weak 16-bit checksum pre-filter triggered 98% false-positive full scans due to birthday-paradox collisions.'
      ],
      metricsAndLogs: {
        errorRate: '19.5%',
        latencyP99: '3,400ms',
        downstreamCpu: '97.2%',
        effectiveRps: 28,
        baselineRps: 900,
        timeseries: [
          { time: '12:00:00', cpu: 25, latencyP99: 14, errorRate: 0.0, rps: 890 },
          { time: '12:05:00', cpu: 97, latencyP99: 3400, errorRate: 19.5, rps: 28 }
        ],
        logs: [
          { timestamp: '12:04:11.092', level: 'WARN', service: 'dlp-scanner', message: 'Rule pack updated to K=2,500 patterns; per-byte comparisons jumped to 2,500x.' },
          { timestamp: '12:04:48.550', level: 'ERROR', service: 'dlp-scanner', message: 'Document scan (5.2MB) performed 1.3 × 10^10 character comparisons in 3,390ms.' },
          { timestamp: '12:05:02.114', level: 'ERROR', service: 'dlp-gateway', message: 'Inspection queue overflow; dropping 19.5% of attachment scans.' }
        ]
      },
      slaImpact: 'DLP attachment inspection throughput drops 32× whenever pattern dictionary exceeds 2,000 signatures.',
      rootCauses: [
        {
          id: 'rc-multi-pass-k-scans',
          description: 'Executing K independent single-pattern scans re-reads the length-N text K times in O(N · K) time instead of advancing a single Aho-Corasick automaton state in O(N + M + Z).',
          correct: true,
          feedback: 'Correct! Aho-Corasick merges all K patterns into one trie with failure links so every character of the text is read exactly once in O(N + M + Z) total time, independent of K!'
        },
        {
          id: 'rc-string-slice-alloc',
          description: 'String.prototype.indexOf allocates a copy of the haystack on every call.',
          correct: false,
          feedback: 'Incorrect. indexOf does not copy the haystack, but calling it K = 2,500 times still scans the 5MB text 2,500 times.'
        },
        {
          id: 'rc-unicode-normalization',
          description: 'NFC Unicode normalization is running inside the inner loop.',
          correct: false,
          feedback: 'Incorrect. Normalization runs once before scanning; the 2,500× slowdown is proportional to pattern count K.'
        },
        {
          id: 'rc-gc-string-intern',
          description: 'Pattern strings are not interned in the V8 string table.',
          correct: false,
          feedback: 'Incorrect. String interning only speeds up equality of identical strings, not substring search across 2,500 distinct patterns.'
        }
      ],
      invariants: [
        'In an Aho-Corasick automaton, the failure link fail[u] points to the longest proper suffix of string(u) that is also a prefix of some pattern in the trie.',
        'Building failure links in BFS level-order guarantees that when computing fail[v] for child v = goto(u, c), fail[u] and all its ancestors already have valid failure links.',
        'Propagating output sets along failure links (out[v] = out[v] ∪ out[fail[v]]) ensures all overlapping suffix matches are reported in O(1) per match.'
      ],
      interactiveTuning: [
        {
          id: 'multiPatternAlgorithm',
          label: 'Multi-Pattern Matching Engine',
          type: 'select',
          options: ['k-independent-indexof-loops', 'rabin-karp-16bit-mod', 'aho-corasick-dfa-automaton'],
          defaultValue: 'k-independent-indexof-loops',
          description: 'Algorithm used to match K patterns simultaneously against a text stream.'
        },
        {
          id: 'failureLinkResolution',
          label: 'Automaton Transition Table',
          type: 'select',
          options: ['unmemoized-failure-chain-walk', 'bfs-precomputed-dfa-transitions'],
          defaultValue: 'unmemoized-failure-chain-walk',
          description: 'Precompute next[u][c] during BFS so every text byte takes exactly 1 table lookup.'
        },
        {
          id: 'outputLinkMerge',
          label: 'Suffix Match Reporting',
          type: 'select',
          options: ['ignore-suffix-subpatterns', 'bfs-merged-output-links'],
          defaultValue: 'ignore-suffix-subpatterns',
          description: 'Accumulate pattern outputs from fail[v] during BFS so nested patterns ("he" inside "she") are never missed.'
        },
        {
          id: 'streamChunkKb',
          label: 'L1-Cache Stream Chunk Size',
          type: 'range',
          min: 16,
          max: 512,
          step: 16,
          defaultValue: 32,
          unit: 'KB',
          description: 'Process text in L1-cache-resident chunks while preserving automaton state.'
        }
      ],
      optimalPreset: {
        multiPatternAlgorithm: 'aho-corasick-dfa-automaton',
        failureLinkResolution: 'bfs-precomputed-dfa-transitions',
        outputLinkMerge: 'bfs-merged-output-links',
        streamChunkKb: 64
      },
      verify: function(knobs) {
        var isAC = knobs.multiPatternAlgorithm === 'aho-corasick-dfa-automaton';
        var isDfa = knobs.failureLinkResolution === 'bfs-precomputed-dfa-transitions';
        var isOut = knobs.outputLinkMerge === 'bfs-merged-output-links';
        var ok = isAC && isDfa && isOut;
        return {
          success: ok,
          message: ok
            ? 'DLP scanner accelerated 240×! Single-pass Aho-Corasick automaton with BFS-merged output links scanned 5MB against 2,500 patterns in 14.1ms.'
            : 'Scanner still misses nested suffix patterns or performs O(N · K) passes. Select aho-corasick-dfa-automaton, bfs-precomputed-dfa-transitions, and bfs-merged-output-links.',
          metrics: {
            latencyP99: ok ? '14.1ms' : '3,400ms',
            errorRate: ok ? '0.00%' : '19.5%',
            downstreamCpu: ok ? '15.4%' : '97.2%',
            effectiveRps: ok ? 900 : 28
          }
        };
      },
      codeFix: {
        title: 'Build Single-Pass Aho-Corasick Multi-Pattern Scanner with Failure Links',
        summary: 'Implement AhoCorasick with BFS failure links and merged output lists so all K patterns (including overlapping suffix matches like "he" inside "ushers") are found in one O(N + M + Z) pass.',
        buggyCode: `class MultiPatternScanner {
  constructor(patterns) {
    this.patterns = patterns;
  }
  // BUG: O(N * K) multi-pass scan AND misses overlapping occurrences of the same pattern!
  countAllMatches(text) {
    let total = 0;
    for (const pat of this.patterns) {
      const idx = text.indexOf(pat);
      if (idx !== -1) total++;
    }
    return total;
  }
}`,
        solutionCode: `class MultiPatternScanner {
  constructor(patterns) {
    this.next = [new Map()];
    this.fail = [0];
    this.outputCount = [0];

    for (const pat of patterns) {
      if (!pat) continue;
      let u = 0;
      for (let i = 0; i < pat.length; i++) {
        const c = pat[i];
        if (!this.next[u].has(c)) {
          const v = this.next.length;
          this.next.push(new Map());
          this.fail.push(0);
          this.outputCount.push(0);
          this.next[u].set(c, v);
        }
        u = this.next[u].get(c);
      }
      this.outputCount[u]++;
    }

    const queue = [];
    for (const [, v] of this.next[0].entries()) {
      this.fail[v] = 0;
      queue.push(v);
    }
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const [c, v] of this.next[u].entries()) {
        let f = this.fail[u];
        while (f > 0 && !this.next[f].has(c)) f = this.fail[f];
        if (this.next[f].has(c)) f = this.next[f].get(c);
        this.fail[v] = f;
        this.outputCount[v] += this.outputCount[f];
        queue.push(v);
      }
    }
  }
  countAllMatches(text) {
    let u = 0, total = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      while (u > 0 && !this.next[u].has(c)) u = this.fail[u];
      if (this.next[u].has(c)) u = this.next[u].get(c);
      total += this.outputCount[u];
    }
    return total;
  }
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
// Classic Aho-Corasick test: patterns ['he', 'she', 'his', 'hers'] in 'ushers'
// Matches in 'ushers': 'she' (at 1..3), 'he' (at 2..3), 'hers' (at 2..5) => 3 matches!
const ac = new MultiPatternScanner(['he', 'she', 'his', 'hers']);
assert.strictEqual(ac.countAllMatches('ushers'), 3);
assert.strictEqual(ac.countAllMatches('ahishers'), 4); // 'his', 'she', 'he', 'hers'

// Overlapping repeats: 'aa' in 'aaaaa' occurs at indices 0, 1, 2, 3 => 4 matches
const ac2 = new MultiPatternScanner(['aa', 'aaa']);
assert.strictEqual(ac2.countAllMatches('aaaaa'), 4 + 3);
console.log('PASS');`
      }
    },

    // =========================================================================
    // 10. Dijkstra Priority Queue Explosion (Missing Stale-Entry Guard)
    // =========================================================================
    {
      id: 'chal-10-dijkstra-stale-heap-reinsertion',
      title: 'Dispatch Router Meltdown: Dijkstra Priority Queue Explosion on Dense Graphs',
      subtitle: 'Omitting the stale-distance guard (if (d > dist[u]) continue) and relaxing equal-cost edges triggers exponential vertex re-expansions across dense road-network shortcuts.',
      summary: 'Enforce strict inequality relaxation (dist[u] + w < dist[v]) and discard stale heap entries (if (d > dist[u]) continue) immediately on pop so each vertex expands at most once in O((V + E) log V).',
      severity: 'SEV-1',
      difficulty: 'medium',
      category: 'Shortest Paths & Priority Queues',
      trackId: 'track-5',
      xp: 225,
      estimatedMinutes: 20,
      relatedSlugs: [
        'dijkstra-relaxation-invariants',
        'astar-heuristic-admissibility',
        'build-astar-bidirectional-router'
      ],
      symptoms: [
        'Routing queries on a 25,000-intersection city graph pop over 8,400,000 entries from the priority queue and time out after 6.2 seconds.',
        'Heap memory swells to 480MB per routing request due to duplicate (vertex, distance) pairs flooding the binary heap.',
        'Vertices with high in-degree have their outgoing adjacency lists scanned hundreds of times per query.'
      ],
      metricsAndLogs: {
        errorRate: '54.0%',
        latencyP99: '6,200ms',
        downstreamCpu: '99.7%',
        effectiveRps: 12,
        baselineRps: 1500,
        timeseries: [
          { time: '17:30:00', cpu: 28, latencyP99: 4.5, errorRate: 0.0, rps: 1490 },
          { time: '17:31:00', cpu: 100, latencyP99: 6200, errorRate: 54.0, rps: 12 }
        ],
        logs: [
          { timestamp: '17:30:19.104', level: 'WARN', service: 'dispatch-router', message: 'Dijkstra heap size exceeded 2,000,000 entries on graph with V=25,000, E=120,000.' },
          { timestamp: '17:30:44.819', level: 'ERROR', service: 'dispatch-router', message: 'Vertex u=14902 expanded 412 times (stale heap entries not skipped on pop).' },
          { timestamp: '17:31:02.008', level: 'FATAL', service: 'dispatch-gateway', message: 'Route computation SLA breached (6,200ms > 50ms budget).' }
        ]
      },
      slaImpact: 'Real-time courier dispatch routing fails 54% of requests during peak rush-hour graph updates.',
      rootCauses: [
        {
          id: 'rc-missing-stale-skip-and-le',
          description: 'Lazy deletion in Dijkstra pushes multiple (v, d) entries into the heap; failing to skip stale pops (if (d > dist[u]) continue) and using <= instead of < re-expands vertices exponentially.',
          correct: true,
          feedback: 'Exact diagnosis! With lazy heap insertion, an outdated (u, oldDist) entry remains in the heap after a shorter path to u is found. Without `if (d > dist[u]) continue;`, u and its entire neighborhood are re-expanded on every stale pop!'
        },
        {
          id: 'rc-fibonacci-heap-needed',
          description: 'Binary heaps have O(V²) complexity unless replaced by a Fibonacci heap.',
          correct: false,
          feedback: 'Incorrect. A binary heap with the stale-entry guard expands each vertex once and pushes at most E entries, running in O((V + E) log V) — typically under 5ms for V=25,000.'
        },
        {
          id: 'rc-negative-edge-weights',
          description: 'Road travel times contain negative weight cycles.',
          correct: false,
          feedback: 'Incorrect. All travel times are positive; the blowup occurs on positive-weight DAGs and grids when stale pops are not skipped.'
        },
        {
          id: 'rc-csr-cache-miss',
          description: 'Adjacency lists are stored as JS arrays instead of TypedArrays.',
          correct: false,
          feedback: 'Incorrect. Expanding vertices 400× due to missing `if (d > dist[u]) continue` is an algorithmic bug, not a representation issue.'
        }
      ],
      invariants: [
        'Dijkstra greedy invariant: when vertex u is popped with minimum d === dist[u] and all edge weights are >= 0, dist[u] is final and will never decrease again.',
        'Any subsequent pop of (u, d_old) from a lazy priority queue has d_old > dist[u] and must be discarded in O(1) via `if (d > dist[u]) continue;`.',
        'Edge relaxation must use strict inequality `if (dist[u] + w < dist[v])` to prevent zero-weight or equal-distance cycles from pushing redundant heap entries.'
      ],
      interactiveTuning: [
        {
          id: 'stalePopGuard',
          label: 'Lazy Heap Pop Validation',
          type: 'select',
          options: ['no-guard-expand-every-pop', 'skip-if-d-greater-than-dist-u'],
          defaultValue: 'no-guard-expand-every-pop',
          description: 'Immediately discard popped heap entries where d > dist[u].'
        },
        {
          id: 'relaxationInequality',
          label: 'Edge Relaxation Condition',
          type: 'select',
          options: ['weak-less-or-equal-le', 'strict-less-than-lt'],
          defaultValue: 'weak-less-or-equal-le',
          description: 'Only update dist[v] and push to heap when nd < dist[v].'
        },
        {
          id: 'heapArity',
          label: 'Priority Queue Heap Arity',
          type: 'select',
          options: ['binary-2-heap', 'cache-friendly-4-ary-heap'],
          defaultValue: 'binary-2-heap',
          description: 'Heap branching factor d for siftUp/siftDown cache locality.'
        },
        {
          id: 'earlyTargetStop',
          label: 'Point-to-Point Termination',
          type: 'select',
          options: ['exhaust-entire-graph', 'halt-when-target-popped'],
          defaultValue: 'exhaust-entire-graph',
          description: 'Return immediately once u === target is popped with settled distance.'
        }
      ],
      optimalPreset: {
        stalePopGuard: 'skip-if-d-greater-than-dist-u',
        relaxationInequality: 'strict-less-than-lt',
        heapArity: 'cache-friendly-4-ary-heap',
        earlyTargetStop: 'halt-when-target-popped'
      },
      verify: function(knobs) {
        var hasGuard = knobs.stalePopGuard === 'skip-if-d-greater-than-dist-u';
        var isStrict = knobs.relaxationInequality === 'strict-less-than-lt';
        var ok = hasGuard && isStrict;
        return {
          success: ok,
          message: ok
            ? 'Router recovered! Stale-entry guard + strict inequality relaxation reduced vertex expansions on V=25,000 from 8.4M to <= 25,000 and cut P99 latency to 2.9ms.'
            : 'Dijkstra still re-expands settled vertices or pushes duplicate equal-cost paths. Enable skip-if-d-greater-than-dist-u and strict-less-than-lt.',
          metrics: {
            latencyP99: ok ? '2.9ms' : '6,200ms',
            errorRate: ok ? '0.00%' : '54.0%',
            downstreamCpu: ok ? '16.1%' : '99.7%',
            effectiveRps: ok ? 1500 : 12
          }
        };
      },
      codeFix: {
        title: 'Fix Dijkstra Priority Queue Explosion with Stale-Entry Guard & Strict Relaxation',
        summary: 'Add `if (d > dist[u]) continue;` upon popping from the min-heap and change `<=` to `<` in edge relaxation so dense shortcut graphs run in O((V + E) log V) instead of exponential time.',
        buggyCode: `function dijkstra(n, adj, src) {
  const dist = new Float64Array(n).fill(Infinity);
  dist[src] = 0;
  // Min-heap of [distance, vertex]
  const heap = [[0, src]];
  const push = (item) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      const t = heap[p]; heap[p] = heap[i]; heap[i] = t;
      i = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while ((i << 1) + 1 < heap.length) {
        let l = (i << 1) + 1, r = l + 1, m = i;
        if (heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        const t = heap[i]; heap[i] = heap[m]; heap[m] = t;
        i = m;
      }
    }
    return top;
  };

  let expansions = 0;
  while (heap.length > 0) {
    const [d, u] = pop();
    // BUG 1: Missing stale-entry check! If d > dist[u], u was already settled!
    expansions++;
    for (const [v, w] of adj[u]) {
      // BUG 2: Using <= pushes duplicate equal-distance paths into the heap!
      if (d + w <= dist[v]) {
        dist[v] = d + w;
        push([dist[v], v]);
      }
    }
  }
  return { dist, expansions };
}`,
        solutionCode: `function dijkstra(n, adj, src) {
  const dist = new Float64Array(n).fill(Infinity);
  dist[src] = 0;
  const heap = [[0, src]];
  const push = (item) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      const t = heap[p]; heap[p] = heap[i]; heap[i] = t;
      i = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while ((i << 1) + 1 < heap.length) {
        let l = (i << 1) + 1, r = l + 1, m = i;
        if (heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        const t = heap[i]; heap[i] = heap[m]; heap[m] = t;
        i = m;
      }
    }
    return top;
  };

  let expansions = 0;
  while (heap.length > 0) {
    const [d, u] = pop();
    if (d > dist[u]) continue;
    expansions++;
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        push([dist[v], v]);
      }
    }
  }
  return { dist, expansions };
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
// Construct a 35-vertex diamond/cascade DAG where each vertex u connects to u+1 (weight 10)
// and u+2 (weight 19), causing O(2^V) stale heap expansions if d > dist[u] is not skipped!
const N = 35;
const adj = Array.from({ length: N }, () => []);
for (let i = 0; i < N; i++) {
  for (let j = i + 1; j < N; j++) {
    // Decreasing edge weights for later shortcuts trigger cascading distance reductions
    adj[i].push([j, (j - i) * 100 - (j - i - 1)]);
  }
}
const { dist, expansions } = dijkstra(N, adj, 0);
assert.strictEqual(expansions, N, 'Expected each vertex to expand exactly once, got ' + expansions);
assert.strictEqual(dist[N - 1], (N - 1) * 100 - (N - 2));
console.log('PASS');`
      }
    },

    // =========================================================================
    // 11. Dinic Max-Flow Missing Current-Arc Pointer (O(V^2 E) vs O(E sqrt(V)))
    // =========================================================================
    {
      id: 'chal-11-dinic-missing-current-arc',
      title: 'Cluster Scheduler TLE: Dinic Max-Flow Missing Current-Arc Pointer Optimization',
      subtitle: 'Restarting the adjacency list scan from index 0 on every DFS call inside a blocking-flow phase re-traverses saturated dead-end edges thousands of times.',
      summary: 'Advance a persistent per-vertex current-arc pointer ptr[u] across DFS calls within each BFS level-graph phase so dead-end edges are scanned at most once per phase in O(V E) / O(E √V) time.',
      severity: 'SEV-2',
      difficulty: 'insane',
      category: 'Network Flow & Bipartite Matching',
      trackId: 'track-5',
      xp: 300,
      estimatedMinutes: 30,
      relatedSlugs: [
        'dinic-level-graph-blocking-flow',
        'bipartite-matching-hopcroft-karp',
        'build-dinic-max-flow-engine'
      ],
      symptoms: [
        'Assigning 5,000 containers to 5,000 hosts via Dinic bipartite matching takes 11.8 seconds per scheduling cycle (expected < 15ms).',
        'Within a single BFS level-graph phase, DFS inspects 420,000,000 saturated residual edges despite the graph having only E = 80,000 edges.',
        'Vertices with no remaining augmenting path to sink are visited thousands of times in the same phase.'
      ],
      metricsAndLogs: {
        errorRate: '42.0%',
        latencyP99: '11,800ms',
        downstreamCpu: '100.0%',
        effectiveRps: 2,
        baselineRps: 180,
        timeseries: [
          { time: '21:00:00', cpu: 22, latencyP99: 14, errorRate: 0.0, rps: 178 },
          { time: '21:01:00', cpu: 100, latencyP99: 11800, errorRate: 42.0, rps: 2 }
        ],
        logs: [
          { timestamp: '21:00:12.400', level: 'WARN', service: 'pod-scheduler', message: 'Dinic phase 6 DFS inspected 185,000,000 edges on E=80,000 network.' },
          { timestamp: '21:00:24.190', level: 'ERROR', service: 'pod-scheduler', message: 'Saturated arcs [0..ptr[u]-1] re-scanned from i=0 on every augmenting path call.' },
          { timestamp: '21:01:00.010', level: 'FATAL', service: 'cluster-controller', message: 'Pod placement loop timed out after 11.8s; cluster scaling stalled.' }
        ]
      },
      slaImpact: 'Cluster autoscaler fails to place pending pods during traffic surges when bipartite graph exceeds 10,000 nodes.',
      rootCauses: [
        {
          id: 'rc-missing-current-arc-ptr',
          description: 'Without the current-arc pointer ptr[u] (and dead-end pruning level[v] = -1), Dinic DFS restarts at edge index 0 on every call, degrading each blocking-flow phase from O(V E) to O(V² E).',
          correct: true,
          feedback: 'Spot on! In Dinic\'s algorithm, because the level graph is a DAG and edges only saturate (never become newly admissible within a phase), any edge index i < ptr[u] that failed to reach the sink can never carry more flow in the current phase!'
        },
        {
          id: 'rc-edmonds-karp-bfs',
          description: 'Using BFS instead of Dijkstra to build the level graph.',
          correct: false,
          feedback: 'Incorrect. Dinic level graphs are unweighted shortest-hop DAGs built via O(E) BFS.'
        },
        {
          id: 'rc-reverse-edge-xor',
          description: 'Storing reverse edge indices causes integer overflow.',
          correct: false,
          feedback: 'Incorrect. Reverse edge indexing is O(1); the slowdown is re-scanning already-exhausted adjacency prefixes.'
        },
        {
          id: 'rc-ford-fulkerson-irrational',
          description: 'Irrational edge capacities prevent flow termination.',
          correct: false,
          feedback: 'Incorrect. All capacities are integers; the bug is omitting the current-arc pointer `ptr[u]`.'
        }
      ],
      invariants: [
        'Monotonic admissibility invariant: within a single BFS level-graph phase, residual edges only leave the admissible set (when cap === 0 or target vertex becomes a dead end); no new edges enter.',
        'Therefore, advancing `for (; ptr[u] < adj[u].length; ptr[u]++)` ensures each edge is advanced past at most once per phase (O(E) pointer increments per phase).',
        'When `dfs(v, ...)` returns 0 pushed flow, setting `level[v] = -1` (or advancing `ptr[u]`) immediately prunes dead-end vertex v from all future DFS visits in that phase.'
      ],
      interactiveTuning: [
        {
          id: 'arcScanStrategy',
          label: 'DFS Adjacency Scan Strategy',
          type: 'select',
          options: ['restart-from-zero-every-dfs', 'persistent-current-arc-ptr'],
          defaultValue: 'restart-from-zero-every-dfs',
          description: 'Maintain ptr[u] across all DFS calls within a single BFS level-graph phase.'
        },
        {
          id: 'deadEndPruning',
          label: 'Dead-End Vertex Pruning',
          type: 'select',
          options: ['none', 'mark-level-minus-one-on-zero-flow'],
          defaultValue: 'none',
          description: 'Set level[u] = -1 when a vertex cannot push any flow to the sink.'
        },
        {
          id: 'multiAugmentPerDfs',
          label: 'Blocking Flow Augmentation Mode',
          type: 'select',
          options: ['single-path-per-root-dfs', 'multi-path-accumulate-in-dfs'],
          defaultValue: 'single-path-per-root-dfs',
          description: 'Push multiple augmenting paths in a single DFS call until u is saturated.'
        },
        {
          id: 'bfsEarlyExit',
          label: 'BFS Level Graph Termination',
          type: 'select',
          options: ['full-graph-bfs', 'stop-once-sink-level-settled'],
          defaultValue: 'full-graph-bfs',
          description: 'Detect sink reachability during BFS level construction.'
        }
      ],
      optimalPreset: {
        arcScanStrategy: 'persistent-current-arc-ptr',
        deadEndPruning: 'mark-level-minus-one-on-zero-flow',
        multiAugmentPerDfs: 'multi-path-accumulate-in-dfs',
        bfsEarlyExit: 'stop-once-sink-level-settled'
      },
      verify: function(knobs) {
        var hasPtr = knobs.arcScanStrategy === 'persistent-current-arc-ptr';
        var hasPrune = knobs.deadEndPruning === 'mark-level-minus-one-on-zero-flow';
        var ok = hasPtr && hasPrune;
        return {
          success: ok,
          message: ok
            ? 'Scheduler restored! Dinic current-arc pointer ptr[u] + dead-end pruning reduced edge inspections by 5,200× and solved 10,000-node matching in 8.4ms (O(E √V)).'
            : 'DFS still re-scans saturated or dead-end edges within a phase. Enable persistent-current-arc-ptr and mark-level-minus-one-on-zero-flow.',
          metrics: {
            latencyP99: ok ? '8.4ms' : '11,800ms',
            errorRate: ok ? '0.00%' : '42.0%',
            downstreamCpu: ok ? '14.5%' : '100.0%',
            effectiveRps: ok ? 180 : 2
          }
        };
      },
      codeFix: {
        title: 'Add Current-Arc Pointer ptr[u] & Dead-End Pruning to Dinic Max-Flow',
        summary: 'Maintain `this.ptr[u]` inside `_dfs(u, t, pushed)` and set `this.level[u] = -1` when a vertex is exhausted so saturated/dead-end edges are never re-scanned in the same phase.',
        buggyCode: `class Dinic {
  constructor(n) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
    this.level = new Int32Array(n);
    this.edgeChecks = 0;
  }
  addEdge(u, v, cap) {
    this.adj[u].push({ to: v, rev: this.adj[v].length, cap });
    this.adj[v].push({ to: u, rev: this.adj[u].length - 1, cap: 0 });
  }
  _bfs(s, t) {
    this.level.fill(-1);
    this.level[s] = 0;
    const q = [s];
    for (let h = 0; h < q.length; h++) {
      const u = q[h];
      for (const e of this.adj[u]) {
        if (e.cap > 0 && this.level[e.to] === -1) {
          this.level[e.to] = this.level[u] + 1;
          q.push(e.to);
        }
      }
    }
    return this.level[t] !== -1;
  }
  _dfs(u, t, pushed) {
    if (pushed === 0 || u === t) return pushed;
    // BUG: Restarts loop from i = 0 on every DFS call instead of using current-arc ptr[u]!
    for (let i = 0; i < this.adj[u].length; i++) {
      this.edgeChecks++;
      const e = this.adj[u][i];
      if (this.level[u] + 1 !== this.level[e.to] || e.cap === 0) continue;
      const tr = this._dfs(e.to, t, Math.min(pushed, e.cap));
      if (tr === 0) continue;
      e.cap -= tr;
      this.adj[e.to][e.rev].cap += tr;
      return tr;
    }
    return 0;
  }
  maxFlow(s, t) {
    let flow = 0;
    while (this._bfs(s, t)) {
      while (true) {
        const pushed = this._dfs(s, t, Infinity);
        if (pushed === 0) break;
        flow += pushed;
      }
    }
    return flow;
  }
}`,
        solutionCode: `class Dinic {
  constructor(n) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
    this.level = new Int32Array(n);
    this.ptr = new Int32Array(n);
    this.edgeChecks = 0;
  }
  addEdge(u, v, cap) {
    this.adj[u].push({ to: v, rev: this.adj[v].length, cap });
    this.adj[v].push({ to: u, rev: this.adj[u].length - 1, cap: 0 });
  }
  _bfs(s, t) {
    this.level.fill(-1);
    this.level[s] = 0;
    const q = [s];
    for (let h = 0; h < q.length; h++) {
      const u = q[h];
      for (const e of this.adj[u]) {
        if (e.cap > 0 && this.level[e.to] === -1) {
          this.level[e.to] = this.level[u] + 1;
          q.push(e.to);
        }
      }
    }
    return this.level[t] !== -1;
  }
  _dfs(u, t, pushed) {
    if (pushed === 0 || u === t) return pushed;
    const edges = this.adj[u];
    for (; this.ptr[u] < edges.length; this.ptr[u]++) {
      this.edgeChecks++;
      const e = edges[this.ptr[u]];
      if (this.level[u] + 1 !== this.level[e.to] || e.cap === 0) continue;
      const tr = this._dfs(e.to, t, Math.min(pushed, e.cap));
      if (tr === 0) continue;
      e.cap -= tr;
      this.adj[e.to][e.rev].cap += tr;
      return tr;
    }
    this.level[u] = -1;
    return 0;
  }
  maxFlow(s, t) {
    let flow = 0;
    while (this._bfs(s, t)) {
      this.ptr.fill(0);
      while (true) {
        const pushed = this._dfs(s, t, Infinity);
        if (pushed === 0) break;
        flow += pushed;
      }
    }
    return flow;
  }
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
// Build a layered network with 200 middle nodes where 190 nodes are dead-ends
// Without current-arc ptr[u] and dead-end pruning, every augmenting path re-scans all 190 dead ends!
const K = 200;
const S = 0, hub = 1, T = K + 2;
const dinic = new Dinic(T + 1);
dinic.addEdge(S, hub, K);
for (let i = 0; i < K; i++) {
  const mid = 2 + i;
  dinic.addEdge(hub, mid, 1);
  if (i >= K - 15) {
    dinic.addEdge(mid, T, 1); // only last 15 reach sink
  }
}
const flow = dinic.maxFlow(S, T);
assert.strictEqual(flow, 15);
assert(dinic.edgeChecks < 1000, 'Expected current-arc pointer to keep edgeChecks < 1000, got ' + dinic.edgeChecks);
console.log('PASS');`
      }
    },

    // =========================================================================
    // 12. DP Exponential Recursion & 2D Table OOM vs Space-Compressed DP
    // =========================================================================
    {
      id: 'chal-12-dp-unmemoized-state-explosion',
      title: 'Cargo Optimizer OOM & Timeout: Exponential Recursion & 2D Knapsack Heap Exhaustion',
      subtitle: 'Unmemoized recursive branching takes Θ(2^N) time, and naive 2D tabulation (N = 5,000 × W = 200,000) allocates a 4GB matrix that crashes the worker with Out-Of-Memory.',
      summary: 'Convert overlapping subproblem recursion into bottom-up dynamic programming with a 1D reverse-iterated rolling array (O(N · W) time and O(W) auxiliary memory).',
      severity: 'SEV-1',
      difficulty: 'medium',
      category: 'Dynamic Programming & Space Compression',
      trackId: 'track-6',
      xp: 250,
      estimatedMinutes: 20,
      relatedSlugs: [
        'memoization-tabulation-space-rolling',
        'knapsack-family-01-unbounded-bounded',
        'build-hirschberg-linear-space-diff'
      ],
      symptoms: [
        'Batch optimizer hangs forever when item count N exceeds 38 in recursive mode (2^38 = 274 billion calls).',
        'Switching to a 2D table dp[N + 1][W + 1] for N = 5,000 items and capacity W = 200,000 crashes V8 with FATAL ERROR: Reached heap limit Allocation failed (10^9 cells).',
        'Iterating the 1D array forward (w from weight to W) accidentally allows using the same unique container item multiple times (Unbounded vs 0/1 Knapsack bug).'
      ],
      metricsAndLogs: {
        errorRate: '88.0%',
        latencyP99: '24,000ms',
        downstreamCpu: '100.0%',
        effectiveRps: 1,
        baselineRps: 450,
        timeseries: [
          { time: '23:00:00', cpu: 20, latencyP99: 12, errorRate: 0.0, rps: 448 },
          { time: '23:01:00', cpu: 100, latencyP99: 24000, errorRate: 88.0, rps: 1 }
        ],
        logs: [
          { timestamp: '23:00:15.110', level: 'ERROR', service: 'cargo-optimizer', message: 'Recursive solver exceeded 100,000,000 calls on N=42 items (overlapping subproblems not memoized).' },
          { timestamp: '23:00:32.405', level: 'FATAL', service: 'cargo-optimizer', message: 'OOM in 2D DP allocation: 5,001 × 200,001 Float64Array requires 8.00 GB heap.' },
          { timestamp: '23:00:55.900', level: 'ERROR', service: 'cargo-audit', message: 'Forward 1D loop (w = wt..W) duplicated single-use item #7 four times in manifest!' }
        ]
      },
      slaImpact: 'Logistics bin-packing service crashes with OOM or times out on 88% of freight manifests.',
      rootCauses: [
        {
          id: 'rc-unmemoized-and-2d-oom',
          description: 'Unmemoized recursion recomputes identical (i, w) states Θ(2^N) times, while a full 2D table uses Θ(N · W) space even though row i depends exclusively on row i - 1.',
          correct: true,
          feedback: 'Exact diagnosis! Because dp[i][w] = max(dp[i-1][w], dp[i-1][w - wt] + val) only reads from row i - 1 at smaller capacities, a single 1D array of length W + 1 iterated backwards (w = W down to wt) solves 0/1 Knapsack in O(N · W) time and O(W) space!'
        },
        {
          id: 'rc-greedy-value-density',
          description: '0/1 Knapsack should be solved by sorting items by value/weight ratio.',
          correct: false,
          feedback: 'Incorrect. Greedy by value-to-weight density is only optimal for Fractional Knapsack; it can be arbitrarily suboptimal for 0/1 Knapsack.'
        },
        {
          id: 'rc-tail-call-optimization',
          description: 'Enabling ES6 proper tail calls reduces 2^N recursion to O(N).',
          correct: false,
          feedback: 'Incorrect. Two recursive calls per state form a binary recursion tree of size 2^N; tail-call elimination cannot collapse branching trees.'
        },
        {
          id: 'rc-sparse-hash-map-dp',
          description: 'Using a string-keyed Map("i:w") is faster than a contiguous TypedArray.',
          correct: false,
          feedback: 'Incorrect. String allocation and hashing for N · W states is 50× slower and still OOMs compared to a single O(W) Int32Array/Float64Array.'
        }
      ],
      invariants: [
        'Row-dependency invariant: in 0/1 Knapsack, state dp[i][w] depends only on dp[i - 1][w] and dp[i - 1][w - weight[i]] from the immediately preceding row.',
        'Reverse iteration invariant: iterating capacity w downwards from W to weight[i] ensures that when computing dp[w], dp[w - weight[i]] still holds the value from row i - 1 (preventing an item from being picked twice).',
        'Forward iteration (w from weight[i] up to W) transitions from row i itself, solving Unbounded Knapsack instead of 0/1 Knapsack.'
      ],
      interactiveTuning: [
        {
          id: 'dpEvaluationStrategy',
          label: 'DP Evaluation & Memory Layout',
          type: 'select',
          options: ['unmemoized-recursive-tree', 'full-2d-matrix-n-by-w', 'rolling-1d-typed-array-o-w'],
          defaultValue: 'unmemoized-recursive-tree',
          description: 'State space representation and memory footprint.'
        },
        {
          id: 'capacityLoopDirection',
          label: '1D Capacity Iteration Order',
          type: 'select',
          options: ['forward-w-from-wt-to-W-unbounded-bug', 'reverse-w-from-W-down-to-wt-01-exact'],
          defaultValue: 'forward-w-from-wt-to-W-unbounded-bug',
          description: 'Loop direction over capacity w to enforce 0/1 single-item selection.'
        },
        {
          id: 'upperBoundClamp',
          label: 'Prefix Weight Sum Clamping',
          type: 'select',
          options: ['always-scan-full-W', 'clamp-to-running-sum-of-weights'],
          defaultValue: 'always-scan-full-W',
          description: 'Start reverse loop at min(W, sumOfWeightsSoFar) to skip unreachable capacities.'
        },
        {
          id: 'arrayElementKind',
          label: 'DP Buffer Representation',
          type: 'select',
          options: ['boxed-nested-arrays', 'contiguous-float64-array'],
          defaultValue: 'boxed-nested-arrays',
          description: 'Use contiguous L1/L2-friendly TypedArray for vectorized inner loop.'
        }
      ],
      optimalPreset: {
        dpEvaluationStrategy: 'rolling-1d-typed-array-o-w',
        capacityLoopDirection: 'reverse-w-from-W-down-to-wt-01-exact',
        upperBoundClamp: 'clamp-to-running-sum-of-weights',
        arrayElementKind: 'contiguous-float64-array'
      },
      verify: function(knobs) {
        var is1D = knobs.dpEvaluationStrategy === 'rolling-1d-typed-array-o-w';
        var isRev = knobs.capacityLoopDirection === 'reverse-w-from-W-down-to-wt-01-exact';
        var ok = is1D && isRev;
        return {
          success: ok,
          message: ok
            ? 'Optimizer recovered! 1D reverse-iterated Float64Array reduced memory footprint from 8.0 GB to 1.6 MB (5,000× reduction) and solved N=5,000 in 14.5ms.'
            : 'Solver still suffers from O(2^N) recursion, O(N · W) memory OOM, or forward-loop item duplication. Select rolling-1d-typed-array-o-w and reverse-w-from-W-down-to-wt-01-exact.',
          metrics: {
            latencyP99: ok ? '14.5ms' : '24,000ms',
            errorRate: ok ? '0.00%' : '88.0%',
            downstreamCpu: ok ? '21.0%' : '100.0%',
            effectiveRps: ok ? 450 : 1
          }
        };
      },
      codeFix: {
        title: 'Replace Exponential 0/1 Knapsack Recursion with O(W)-Space Reverse Rolling Array',
        summary: 'Rewrite solveZeroOneKnapsack(weights, values, W) using a single 1D Float64Array(W + 1) iterated backwards (for w = maxW; w >= wt; w--) in O(N · W) time and O(W) space.',
        buggyCode: `function solveZeroOneKnapsack(weights, values, W) {
  // BUG: Unmemoized O(2^N) recursion times out for N >= 40!
  function dfs(i, rem) {
    if (i === weights.length || rem <= 0) return 0;
    let best = dfs(i + 1, rem);
    if (weights[i] <= rem) {
      best = Math.max(best, values[i] + dfs(i + 1, rem - weights[i]));
    }
    return best;
  }
  return dfs(0, W);
}`,
        solutionCode: `function solveZeroOneKnapsack(weights, values, W) {
  const dp = new Float64Array(W + 1);
  for (let i = 0; i < weights.length; i++) {
    const wt = weights[i];
    const val = values[i];
    for (let w = W; w >= wt; w--) {
      const candidate = dp[w - wt] + val;
      if (candidate > dp[w]) dp[w] = candidate;
    }
  }
  return dp[W];
}`,
        testCode: `const assert = Object.assign((c, m) => { if (!c) throw new Error(m || 'Assertion failed'); }, { strictEqual: (a, b, m) => { if (a !== b) throw new Error(m || ('Expected ' + b + ', got ' + a)); }, deepStrictEqual: (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m || ('Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a))); }, ok: (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); } });
// 1. Verify exact 0/1 knapsack optimality (and ensure items are not reused!)
// Item 0: wt=3, val=10 (high density, but if reused 3 times gives 30; in 0/1 optimal is wt 3+4+3=10 -> val 10+14+12=36)
assert.strictEqual(solveZeroOneKnapsack([3, 4, 5, 3], [10, 14, 16, 12], 10), 36);

// 2. Test N = 200 items, W = 2,000 (2^200 in unmemoized recursion, < 5ms in 1D rolling DP)
const weights = Array.from({ length: 200 }, (_, i) => (i % 17) + 1);
const values = Array.from({ length: 200 }, (_, i) => ((i * 7) % 50) + 10);
const t0 = Date.now();
const ans = solveZeroOneKnapsack(weights, values, 1000);
assert.strictEqual(ans, 5572);
assert(Date.now() - t0 < 100, 'Expected O(N * W) 1D rolling DP under 100ms');
console.log('PASS');`
      }
    }
  ];

  // Attach self-referential .challenges array property so both Array and Object consumers work seamlessly
  CHALLENGES_DATA.challenges = CHALLENGES_DATA;

  root.CHALLENGES_DATA = CHALLENGES_DATA;
  root.ChallengesData = CHALLENGES_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
