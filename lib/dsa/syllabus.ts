export type Bucket = {
  label: string;
  items: string[];
};

export type Chapter = {
  id: string;
  title: string;
  buckets: Bucket[];
};

export const DSA_FACTS = [
  "Data structures manage how data is stored and accessed. Algorithms focus on processing this data.",
  "Examples of data structures: Array, Linked List, Tree, Heap. Examples of algorithms: Binary Search, Quick Sort, Merge Sort.",
  "This is the foundation of almost every software you use: GPS, search engines, AI chatbots, games, databases, and web apps.",
  "Top companies like Google, Microsoft, Amazon, Apple, and Meta focus heavily on DSA in interviews.",
  "Learning DSA boosts your problem-solving ability and makes you a stronger programmer.",
];

export const LEARNING_ADVICE =
  "If you are a complete beginner, skip the hard problems of every section on the first pass. Come back to them later.";

export const SYLLABUS: Chapter[] = [
  {
    id: "fundamentals",
    title: "Fundamentals",
    buckets: [
      {
        label: "Programming",
        items: [
          "Input and Output",
          "Conditional Statements",
          "For loop",
          "While loop",
          "Function",
          "Classes and Objects",
        ],
      },
      {
        label: "Complexity Analysis",
        items: [
          "Order of Growth",
          "Asymptotic Analysis",
          "Big-O",
          "Theta",
          "Big-Ω",
          "Time Complexity",
          "Space Complexity",
        ],
      },
    ],
  },
  {
    id: "maths",
    title: "Maths, Pattern & Recursion",
    buckets: [
      { label: "Theory", items: ["Recursion", "Analysis of Recursion"] },
      {
        label: "Easy Maths",
        items: ["Even or Odd", "Sum of Naturals", "Closest Number", "Sum of Consecutive"],
      },
      {
        label: "Easy Pattern",
        items: ["Solid Rectangle", "Floyd's Triangle", "Hollow rectangle"],
      },
      {
        label: "Easy Recursion",
        items: ["Print 1 to n", "Print n to 1", "Factorial", "GCD", "Power"],
      },
      { label: "Medium Pattern", items: ["Pyramid", "Hollow Diamond"] },
      {
        label: "Medium Maths",
        items: [
          "Count Digits",
          "Prime Testing",
          "Armstrong Number",
          "Trailing Zeros",
          "Prime Factors",
          "All Divisors",
        ],
      },
      {
        label: "Hard",
        items: [
          "Butterfly",
          "Palindrome Number",
          "Tower of Hanoi",
          "Non-Attacking Knights",
          "Josephus",
          "Water Jug",
        ],
      },
    ],
  },
  {
    id: "array-string",
    title: "Array & String",
    buckets: [
      { label: "Theory", items: ["Array", "String", "Matrix"] },
      {
        label: "Easy Array",
        items: [
          "Is Sorted",
          "Multiply with Adjacent",
          "Reverse",
          "Reverse in Groups",
          "Rotate",
          "Generate All Subarrays",
          "Arrange by Sign",
          "Stock with 1 Transaction",
          "Stock with Multiple Transactions",
          "Leaders",
        ],
      },
      {
        label: "Easy String",
        items: [
          "Same Strings",
          "Palindrome",
          "Toggle Case",
          "Remove Occurrences",
          "Remove Spaces",
          "Check Subsequence",
          "First Non-Repeating",
          "Pangram",
        ],
      },
      {
        label: "Medium Array",
        items: [
          "Majority Element",
          "Majority Element II",
          "Sorted subsequence of 3",
          "Count Strictly Increasing Subarrays",
          "Next Permutation",
          "Kadane's Algorithm",
          "Sum of all subarrays",
          "Max Product Subarray",
        ],
      },
      {
        label: "Medium String",
        items: ["Implement atoi", "URLify", "Multiply Large Numbers"],
      },
      {
        label: "2D Array",
        items: [
          "Diagonal Traversal",
          "Magic Square",
          "Boundary Traversal",
          "Matrix Spiral",
          "Toeplitz Matrix",
          "Matrix Zig-Zag",
          "Transpose of Matrix",
          "Rotate a matrix by 90",
          "Conway’s Game Of Life",
          "Queries in a Matrix",
          "Set Matrix 0",
        ],
      },
      {
        label: "Hard",
        items: [
          "Max Circular Subarray Sum",
          "Next Smallest Palindrome",
          "Lexicographic Rank",
          "Text Justification",
        ],
      },
    ],
  },
  {
    id: "searching",
    title: "Searching",
    buckets: [
      { label: "Theory", items: ["Searching"] },
      {
        label: "Linear Search",
        items: ["Largest", "Second Largest", "Local Min & Max"],
      },
      {
        label: "Binary Search",
        items: [
          "Insertion Position",
          "Lower Bound",
          "Upper Bound",
          "Single Element",
          "Missing Natural",
          "Count Occurrences",
          "2D Search",
          "Sorted & Rotated",
          "Sorted & Rotated II",
          "K Closest",
          "Search in Almost Sorted",
          "Peak",
          "Peak in 2D",
          "Range based Counts",
          "Kth Missing",
          "Search in Row-Column Sorted",
        ],
      },
      {
        label: "Search on answer",
        items: [
          "Square Root",
          "Nth Root",
          "Check Power",
          "Pick K",
          "N trailing zeroes",
          "Book Allocation",
          "Koko Eating Banana",
          "Aggressive Cows",
          "Median in a Row Sorted",
          "Kth Smallest in Row and Column Sorted",
          "M bouquets",
          "kth in Multiplication Table",
          "Maximize Median",
          "Min Time for Orders",
          "Equalize Towers",
        ],
      },
      {
        label: "Search on Two",
        items: ["Median of two sorted", "Kth of two sorted"],
      },
    ],
  },
  {
    id: "sorting",
    title: "Sorting",
    buckets: [
      { label: "Theory", items: ["Sorting"] },
      { label: "Easy", items: ["Wave Form", "Sort by Length", "Min Diff Pair"] },
      {
        label: "Medium",
        items: [
          "Merge Overlapping",
          "Form Largest",
          "Tywin's War Strategy",
          "Candy Cost",
          "Meeting Rooms",
          "Insert Merge Intervals",
          "Minimize Moves",
          "Max sum of i*arr[i]",
        ],
      },
      {
        label: "Partition & Quick Sort Based",
        items: ["Quick Sort", "Sort Binary", "Zeroes to End", "Sort Ternary"],
      },
      {
        label: "Merge & Merge Sort Based",
        items: [
          "Merge Sort",
          "Union of 2 Sorted",
          "Intersection of 2 Sorted",
          "Merge Without Extra Space",
          "Minimum Platforms",
          "Inversion count",
          "Surpasser Count",
        ],
      },
      {
        label: "Cycle Sort Based",
        items: ["Cycle Sort", "Minimum Missing Positive", "Min Swaps to Sort"],
      },
    ],
  },
  {
    id: "bits",
    title: "Bit Manipulation",
    buckets: [
      { label: "Theory", items: ["Bitwise"] },
      {
        label: "Easy",
        items: ["Swap without Third", "Kth Set Bit", "Only set bit", "Power of two", "Sort by Set bits"],
      },
      {
        label: "Medium",
        items: [
          "Power of 4",
          "Binary is palindrome",
          "Rotate Bits",
          "Swap Odd Even",
          "Count Set",
          "Count Total Set",
          "Iterative Power",
        ],
      },
      {
        label: "Bit with Arrays",
        items: [
          "Max Consecutive 1s",
          "Missing",
          "One Odd",
          "Two Odds",
          "Palindrome Permutation",
          "Missing & Repeating",
          "Unique Numbers II",
          "n-bit Gray Codes",
          "Hamming Distance",
          "Sum of Pair XORs",
          "Sum of Subset XORs",
          "Subarray XORs",
          "Is Valid Sudoku",
        ],
      },
      { label: "Subsets", items: ["Subsets", "Subsequences"] },
    ],
  },
  {
    id: "hashing",
    title: "Hashing",
    buckets: [
      { label: "Theory", items: ["Hashing"] },
      {
        label: "Basic Hashing",
        items: [
          "Linear Probing",
          "Separate Chaining",
          "Quadratic Probing",
          "Distinct in Array",
          "Is Subset",
          "Union",
          "Intersection",
          "2 Sum",
          "Fizz Buzz",
          "Pair Sums Divisible by k",
          "Roman to Integer",
          "Isomorphic Strings",
        ],
      },
      {
        label: "Hashing for Frequency",
        items: ["Count Frequencies", "Most Frequent", "Max Subsets", "Anagrams"],
      },
      {
        label: "Subsequence",
        items: ["Longest Consecutive Subsequence", "Consecutive Subsequence"],
      },
    ],
  },
  {
    id: "two-pointer",
    title: "Two-Pointer",
    buckets: [
      { label: "Theory", items: ["Two-Pointer"] },
      {
        label: "Easy",
        items: ["2 Sum in Sorted", "Smallest Subarray", "Unique Elements", "Sentence Palindrome"],
      },
      {
        label: "Medium",
        items: [
          "3 Sum",
          "Celebrity Problem",
          "Closest Pair from 2",
          "Container with Most Water",
          "Common in 3",
          "Reverse Words",
          "Policemen catch thieves",
        ],
      },
      { label: "Hard", items: ["4 Sum", "Closest Triplet", "Count Triplets"] },
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    buckets: [
      { label: "Theory", items: ["Sliding Window"] },
      {
        label: "Fixed Length Window",
        items: [
          "Max Sum Subarray of size K",
          "Max XOR of K size",
          "Distinct In Every Window",
          "MEX Of Subarrays",
          "Min Swaps to group all 1's",
          "First negative in every window",
          "Chocolate Distribution",
        ],
      },
      {
        label: "Variable Length",
        items: [
          "Maximize Ones",
          "Equal substring with cost less than K",
          "Fruit Into Baskets",
          "Subarray with given sum",
        ],
      },
      {
        label: "Minimum length",
        items: [
          "Smallest subarray with sum greater than x",
          "Minimum Window Subsequence",
          "Minimum Window Substring",
          "Smallest containing 0, 1 and 2",
        ],
      },
      {
        label: "Count Subarrays",
        items: [
          "Subarrays with k odds",
          "Subarrays Less Than K",
          "Substrings with all vowels",
          "Number of Subarrays having sum less than K",
          "Count Subarrays with K Equal Value Pairs",
        ],
      },
      {
        label: "Sliding Window with Hashing",
        items: [
          "Longest substring with distinct",
          "Substring character replacement",
          "Longest Substring with K Uniques",
          "Substrings with k distinct",
          "Smallest with all characters",
          "Smallest distinct",
          "Count Anagrams",
          "Full Distinct Subarrays",
        ],
      },
    ],
  },
  {
    id: "prefix-sum",
    title: "Prefix Sum",
    buckets: [
      { label: "Theory", items: ["Prefix Sum"] },
      {
        label: "Prefix Sum",
        items: [
          "Prefix Sum Array",
          "Prefix Sum on 2D",
          "Range Queries",
          "Equilibrium Index",
          "Mean of range",
          "Split array",
          "Largest Submatrix",
          "Max sum rectangle",
        ],
      },
      {
        label: "Prefix / Suffix Transformation",
        items: ["Product of Array Except Self", "Original Array", "Longest Span"],
      },
      {
        label: "Difference Array",
        items: [
          "Diff Array",
          "2D Diff",
          "Max occurring in ranges",
          "Compute before Matrix",
          "Point Counts from Intervals",
        ],
      },
      {
        label: "Prefix Sum with Hashing",
        items: [
          "Subarray with 0 sum",
          "Largest with 0 sum",
          "Largest with Equal 0s and 1s",
          "Largest with sum divisible by k",
          "Longest with Sum K",
          "Count with Sum Divisible By K",
          "Count having Sum K",
          "Count with given XOR",
        ],
      },
    ],
  },
  {
    id: "backtracking",
    title: "Backtracking",
    buckets: [
      { label: "Theory", items: ["Backtracking"] },
      { label: "Medium", items: ["Permutations", "Rat in a Maze", "Word Search"] },
      {
        label: "Hard",
        items: [
          "N Queen Problem",
          "Sudoku Solver",
          "Word Break",
          "Knight's Tour",
          "Palindromic Partitions",
          "M-Coloring",
        ],
      },
    ],
  },
  {
    id: "linked-list",
    title: "Linked List",
    buckets: [
      { label: "Theory", items: ["Linked-list", "Singly", "Doubly & Circular"] },
      {
        label: "Reversal Pattern",
        items: [
          "Reverse Singly",
          "Reverse a Doubly",
          "Reverse in Groups (K-group reversal)",
          "Reorder List",
        ],
      },
      {
        label: "Fast & Slow Pointer",
        items: [
          "Middle",
          "Remove Nth from End",
          "Check Palindrome",
          "Detect Cycle",
          "Length of Loop",
          "Intersection of Y Shaped",
        ],
      },
      {
        label: "Sorting & Merging Pattern",
        items: ["Sort 0s, 1s, 2s", "Add Two Numbers", "Rotate", "Merge K Sorted"],
      },
      { label: "Design", items: ["Browser History", "Twitter", "LRU Cache", "LFU Cache"] },
      { label: "Hard", items: ["Flattening", "Clone with Random Pointer"] },
    ],
  },
  {
    id: "stack",
    title: "Stack",
    buckets: [
      { label: "Theory", items: ["Stack"] },
      { label: "Operations", items: ["Reverse", "Sort"] },
      {
        label: "Expression",
        items: [
          "Check for balanced",
          "Evaluation of Postfix Expression",
          "Infix Evaluation",
          "Infix to Postfix",
          "Redundant Brackets",
          "Longest Valid",
          "Score of Balanced",
        ],
      },
      {
        label: "Design",
        items: [
          "Stack using Queues",
          "Two stacks in an array",
          "K Stacks in an Array",
          "Stack that supports getMin()",
        ],
      },
      {
        label: "Monotonic Stack",
        items: [
          "Lowest by removing k digits",
          "Next Greater Element",
          "Stock Span Problem",
          "Buildings Facing Sun",
          "Previous Smaller Element",
          "Largest Rectangle in a Histogram",
          "Max of 1s",
          "Max of Mins of every window size",
          "Trapping Rain Water",
          "Subarray Range Sum",
          "Replace Adjacent Opposite",
          "Longest Subarray Length",
        ],
      },
      { label: "String Simulation", items: ["Decode String", "Check Redundant Brackets"] },
    ],
  },
  {
    id: "queue",
    title: "Queue",
    buckets: [
      { label: "Theory", items: ["Queue"] },
      {
        label: "Easy",
        items: [
          "Circular Queue",
          "Queue using Stacks",
          "FIFO Page Replacement",
          "Reverse a Queue",
          "Reverse First K",
        ],
      },
      {
        label: "Medium",
        items: [
          "Interleave Queue",
          "K Queues in an array",
          "First non-repeating in a stream",
          "Min Knight steps for target",
        ],
      },
    ],
  },
  {
    id: "deque",
    title: "Deque",
    buckets: [
      { label: "Theory", items: ["Deque"] },
      { label: "Easy", items: ["Circular Array Implementation"] },
      {
        label: "Medium",
        items: [
          "Lexicographically largest permutation",
          "Nth term of given recurrence relation",
          "Generate Bitonic Sequence",
        ],
      },
      {
        label: "Hard",
        items: [
          "Sliding Window Maximum",
          "Longest Subarray with Difference ≤ X",
          "Max Subarray Length with K Increments",
          "Min Deques to Sort Array",
        ],
      },
    ],
  },
  {
    id: "binary-tree",
    title: "Binary Tree",
    buckets: [
      {
        label: "Theory",
        items: ["Binary Tree", "Inorder", "Preorder", "Postorder", "Level Order"],
      },
      {
        label: "Easy",
        items: [
          "Size of Tree",
          "Depth of Tree",
          "Max Width",
          "Balance Check",
          "Identical Trees",
          "Mirror Tree",
          "Sum Tree",
          "Left View",
          "Right View",
          "Path Sum",
          "Max Path Sum",
          "Serialize and Deserialize",
        ],
      },
      {
        label: "Iterative Traversals",
        items: ["Inorder", "Preorder", "Postorder", "Morris Inorder"],
      },
      {
        label: "Medium",
        items: [
          "Longest Sum",
          "Diameter",
          "Boundary Traversal",
          "Tree from Preorder and Inorder",
          "Leaf at Same Level",
          "Connect at Same Level",
          "Nodes without siblings",
          "Invert Tree",
          "Flatten Tree",
          "Max Diff Node & Ancestor",
        ],
      },
      {
        label: "Horizontal Distance Based",
        items: ["Vertical Traversal", "Bottom View", "Top View", "Diagonal Traversal"],
      },
      {
        label: "Hard",
        items: ["Spiral Level Order", "LCA", "Distance K", "Distributed Candies", "Subtree"],
      },
    ],
  },
  {
    id: "bst",
    title: "Binary Search Tree",
    buckets: [
      { label: "Theory", items: ["Binary Search Tree"] },
      {
        label: "Operations",
        items: ["Search", "Insert", "Delete", "Ceil", "Floor", "Predecessor and Successor"],
      },
      { label: "Traversal", items: ["Kth Smallest Element", "2 Sum in BST"] },
      { label: "Construction", items: ["Sorted Array to BST", "Merge two BSTs"] },
      {
        label: "Property",
        items: ["Validate BST", "LCA", "Recover BST", "Largest BST Subtree"],
      },
    ],
  },
  {
    id: "heap",
    title: "Heap",
    buckets: [
      { label: "Theory", items: ["Heap"] },
      {
        label: "Easy",
        items: ["Check for Heap", "Heap Sort", "kth Largest", "K Largests", "Height of a Heap"],
      },
      {
        label: "Medium",
        items: ["Connect n ropes", "Nearly Sorted", "BST to Min Heap", "K Max sum combinations"],
      },
      {
        label: "Hard",
        items: [
          "Median in a stream",
          "K’th largest in a stream",
          "Merge k sorted",
          "Range Covering K Sorted Lists",
          "The Skyline Problem",
          "Sort by Frequency",
        ],
      },
    ],
  },
  {
    id: "graph",
    title: "Graph",
    buckets: [
      { label: "Theory", items: ["Graph Representation"] },
      {
        label: "BFS/DFS Traversal",
        items: [
          "BFS",
          "DFS",
          "Flood Fill",
          "Islands",
          "Connected Components in an Undirected Graph",
          "Cycle in an Undirected graph",
          "Cycle in a Directed",
          "Bipartite",
          "Rotten Oranges",
          "Remove Invalid Parentheses",
        ],
      },
      {
        label: "Topological Sorting",
        items: ["Topological Sorting", "Course Schedule I", "Course Schedule II", "Alien Dictionary"],
      },
      {
        label: "Shortest Path",
        items: [
          "Dijkstra",
          "Floyd Warshall",
          "Bellman–Ford",
          "Minimizing Infection Time in a Directed Graph",
          "Shortest path with one curved edge in an undirected Graph",
          "Minimum Cost Path",
          "Shortest cycle in an undirected graph",
        ],
      },
      {
        label: "Multi-Source BFS",
        items: ["Distance of nearest 1", "Unlock the Lock", "Word Ladder"],
      },
      {
        label: "MST/DSU",
        items: [
          "Prim",
          "Disjoint Set",
          "Kruskal",
          "Detect Cycle using DSU",
          "Total Spanning Trees",
          "Job Sequencing",
          "Number of connected components",
        ],
      },
    ],
  },
  {
    id: "max-flow",
    title: "Maximum Flow",
    buckets: [
      { label: "Theory", items: ["Flow Network", "Residual Graph", "Max-Flow Min-Cut"] },
      {
        label: "Core",
        items: ["Ford-Fulkerson", "Edmonds-Karp", "Dinic's Algorithm", "Minimum Cut"],
      },
      {
        label: "Modelled as flow",
        items: [
          "Bipartite Matching",
          "Maximum Independent Set in Bipartite",
          "Edge Disjoint Paths",
          "Vertex Disjoint Paths",
          "Job Assignment",
          "Baseball Elimination",
        ],
      },
    ],
  },
  {
    id: "greedy",
    title: "Greedy",
    buckets: [
      { label: "Theory", items: ["Greedy"] },
      {
        label: "Easy",
        items: [
          "Fractional Knapsack",
          "Assign Cookies",
          "Min and Max Costs to buy all",
          "Smallest Subset Greater Sum",
          "Min Notes with Given Sum",
        ],
      },
      {
        label: "Medium",
        items: [
          "Activity Selection",
          "Huffman Coding",
          "Jump Game",
          "Job Sequencing",
          "Non-Overlapping Intervals",
          "Gas Station",
        ],
      },
      {
        label: "Hard",
        items: [
          "Stable Marriage",
          "Minimize the Max Height Diff",
          "No two adjacent are same",
          "Minimize cash flow",
          "Min time to finish all jobs with given constraints",
          "Min Cost to cut into squares",
        ],
      },
    ],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    buckets: [
      { label: "Theory", items: ["Dynamic Programming"] },
      {
        label: "1-D DP",
        items: [
          "Climbing Stairs",
          "Count without consecutive 1s",
          "Weighted Climbing Stairs",
          "Frog Jump",
          "House Robber",
          "Max Segments",
          "Coin Change",
          "Possible Decodings",
          "Word Break",
          "Derangements",
        ],
      },
      {
        label: "2-D DP",
        items: [
          "Unique Paths",
          "Minimum cost Path",
          "Longest Common Subsequence",
          "Edit Distance",
          "Distinct Subsequences",
          "Largest Square Submatrix with All 1s",
        ],
      },
      {
        label: "SubSequence",
        items: [
          "Partition Subset",
          "Subset Sum",
          "Subset Count With Sum",
          "Target Sum",
          "0/1 Knapsack",
          "Coin Change II",
          "Rod Cutting",
        ],
      },
      {
        label: "Grid",
        items: ["Unique Paths in a Grid", "Maximum path sum in matrix", "Longest Increasing Path"],
      },
      {
        label: "String",
        items: [
          "Longest Common Substring",
          "Shortest Common Supersequence",
          "Interleaving String",
          "Wildcard Matching",
          "Longest Palindromic Substring",
        ],
      },
      {
        label: "Stock",
        items: [
          "Buy and Sell with Cooldown",
          "Buy and Sell – Max 2 Transactions Allowed",
          "Buy and Sell - k Transactions",
          "Buy and Sell with Transaction Fee",
        ],
      },
      {
        label: "LIS",
        items: [
          "Longest Increasing Subsequence",
          "Number of LISs",
          "Longest Bitonic",
          "Largest Divisible",
          "Longest String Chain",
          "Maximum envelopes",
        ],
      },
      {
        label: "Partition",
        items: [
          "Matrix Chain Multiplication",
          "Minimum Cost to Cut a Stick",
          "Palindrome Partitioning",
          "Boolean Parenthesization",
          "Partition Array for Maximum Sum",
          "Egg Dropping",
          "Optimal Strategy",
        ],
      },
    ],
  },
  {
    id: "number-theory",
    title: "Number Theory",
    buckets: [
      { label: "Easy", items: ["nCr", "Euler's Totient"] },
      { label: "Medium", items: ["Sieve of Eratosthenes", "Pascal's Triangle", "Modular Exponentiation"] },
      { label: "Hard", items: ["Segmented Sieve"] },
    ],
  },
  {
    id: "trie",
    title: "Trie",
    buckets: [
      {
        label: "Implementation",
        items: ["Implement Trie", "Longest Word With All Prefixes", "Count of distinct substrings"],
      },
      {
        label: "Bit Manipulation Trie",
        items: [
          "Duplicates in Binary Matrix",
          "Max XOR of Two",
          "Maximum XOR Queries",
          "Pairs with XOR less than K",
        ],
      },
      {
        label: "Advanced Trie Application",
        items: ["Search Suggestions System", "Palindrome Pairs"],
      },
    ],
  },
  {
    id: "string-matching",
    title: "String Matching",
    buckets: [
      { label: "Theory", items: ["Substring"] },
      {
        label: "Standard Problems",
        items: [
          "Rabin-Karp",
          "KMP",
          "Z algorithm",
          "Longest Prefix Suffix",
          "Manacher's Algorithm",
          "Subarray Search",
        ],
      },
      {
        label: "Hard",
        items: [
          "Longest Palindromic Substring",
          "Palindrome Substring Queries",
          "Min Repeats for Substring",
        ],
      },
    ],
  },
  {
    id: "range-query",
    title: "Range Query",
    buckets: [
      {
        label: "Basic Segment Tree Queries",
        items: ["Segment Tree", "Min-Max Range Queries", "Range LCM Queries", "XOR of a given range"],
      },
      {
        label: "Segment Tree with Updates",
        items: ["Lazy Propagation", "Flipping Sign"],
      },
      {
        label: "Segment Tree Applications",
        items: [
          "Build a segment tree for N-ary rooted tree",
          "Maximum of all subarrays of size K using Segment Tree",
        ],
      },
      {
        label: "Fenwick Tree",
        items: ["Fenwick Tree", "Sum and Update Queries on 3D Matrix"],
      },
    ],
  },
  {
    id: "overview",
    title: "Topic-wise complete tutorials",
    buckets: [
      { label: "Fundamentals", items: ["Maths", "Complexity Analysis"] },
      {
        label: "Data Structures",
        items: [
          "Array",
          "Hashing",
          "Strings",
          "Matrix",
          "Linked List",
          "Stack",
          "Queue",
          "Deque",
          "Tree",
          "Heap",
          "Graph",
        ],
      },
      {
        label: "Algorithms",
        items: [
          "Searching",
          "Sorting",
          "Two Pointer",
          "Window Sliding",
          "Prefix Sum",
          "Recursion",
          "Greedy Algorithms",
          "Dynamic Programming",
        ],
      },
      {
        label: "Advanced Topics",
        items: ["Trie", "Segment Tree", "Red-Black Tree & Binary Indexed Tree"],
      },
      {
        label: "Other Algorithms",
        items: [
          "Bitwise Algorithms",
          "Backtracking",
          "Divide and Conquer",
          "Branch and Bound",
          "Geometric & Randomized",
        ],
      },
    ],
  },
];
