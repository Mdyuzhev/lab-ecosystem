export const demoSimple = [
  {
    "Plan": {
      "Node Type": "Index Scan",
      "Relation Name": "users",
      "Index Name": "users_pkey",
      "Alias": "users",
      "Startup Cost": 0.29,
      "Total Cost": 8.31,
      "Plan Rows": 1,
      "Plan Width": 128,
      "Actual Startup Time": 0.015,
      "Actual Total Time": 0.018,
      "Actual Rows": 1,
      "Actual Loops": 1,
      "Index Cond": "(id = 42)",
      "Rows Removed by Filter": 0,
      "Shared Hit Blocks": 3,
      "Shared Read Blocks": 0
    },
    "Planning Time": 0.082,
    "Triggers": [],
    "Execution Time": 0.035
  }
]

export const demoMedium = [
  {
    "Plan": {
      "Node Type": "Limit",
      "Startup Cost": 15234.56,
      "Total Cost": 15234.81,
      "Plan Rows": 100,
      "Plan Width": 256,
      "Actual Startup Time": 892.451,
      "Actual Total Time": 892.512,
      "Actual Rows": 100,
      "Actual Loops": 1,
      "Plans": [
        {
          "Node Type": "Sort",
          "Parent Relationship": "Outer",
          "Startup Cost": 15234.56,
          "Total Cost": 15484.56,
          "Plan Rows": 100000,
          "Plan Width": 256,
          "Actual Startup Time": 892.448,
          "Actual Total Time": 892.502,
          "Actual Rows": 100,
          "Actual Loops": 1,
          "Sort Key": ["o.total DESC"],
          "Sort Method": "top-N heapsort",
          "Sort Space Used": 42,
          "Sort Space Type": "Memory",
          "Plans": [
            {
              "Node Type": "Hash Join",
              "Parent Relationship": "Outer",
              "Join Type": "Inner",
              "Startup Cost": 1250.00,
              "Total Cost": 14984.56,
              "Plan Rows": 100000,
              "Plan Width": 256,
              "Actual Startup Time": 45.221,
              "Actual Total Time": 823.156,
              "Actual Rows": 98542,
              "Actual Loops": 1,
              "Hash Cond": "(o.customer_id = c.id)",
              "Plans": [
                {
                  "Node Type": "Seq Scan",
                  "Parent Relationship": "Outer",
                  "Relation Name": "orders",
                  "Alias": "o",
                  "Startup Cost": 0.00,
                  "Total Cost": 12500.00,
                  "Plan Rows": 100000,
                  "Plan Width": 200,
                  "Actual Startup Time": 0.012,
                  "Actual Total Time": 534.891,
                  "Actual Rows": 98542,
                  "Actual Loops": 1,
                  "Filter": "(created_at > '2025-01-01'::date)",
                  "Rows Removed by Filter": 401458,
                  "Shared Hit Blocks": 2145,
                  "Shared Read Blocks": 8920
                },
                {
                  "Node Type": "Hash",
                  "Parent Relationship": "Inner",
                  "Startup Cost": 750.00,
                  "Total Cost": 750.00,
                  "Plan Rows": 50000,
                  "Plan Width": 56,
                  "Actual Startup Time": 44.983,
                  "Actual Total Time": 44.983,
                  "Actual Rows": 50000,
                  "Actual Loops": 1,
                  "Hash Buckets": 65536,
                  "Hash Batches": 1,
                  "Peak Memory Usage": 3521,
                  "Plans": [
                    {
                      "Node Type": "Seq Scan",
                      "Parent Relationship": "Outer",
                      "Relation Name": "customers",
                      "Alias": "c",
                      "Startup Cost": 0.00,
                      "Total Cost": 750.00,
                      "Plan Rows": 50000,
                      "Plan Width": 56,
                      "Actual Startup Time": 0.008,
                      "Actual Total Time": 22.341,
                      "Actual Rows": 50000,
                      "Actual Loops": 1,
                      "Shared Hit Blocks": 412,
                      "Shared Read Blocks": 0
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "Planning Time": 1.245,
    "Triggers": [],
    "Execution Time": 892.891
  }
]

export const demoComplex = [
  {
    "Plan": {
      "Node Type": "Sort",
      "Startup Cost": 28450.12,
      "Total Cost": 28475.12,
      "Plan Rows": 10000,
      "Plan Width": 320,
      "Actual Startup Time": 1245.678,
      "Actual Total Time": 1248.901,
      "Actual Rows": 8750,
      "Actual Loops": 1,
      "Sort Key": ["total_amount DESC"],
      "Sort Method": "external merge",
      "Sort Space Used": 15420,
      "Sort Space Type": "Disk",
      "Plans": [
        {
          "Node Type": "Hash Join",
          "Parent Relationship": "Outer",
          "Join Type": "Inner",
          "Startup Cost": 18200.00,
          "Total Cost": 28200.12,
          "Plan Rows": 10000,
          "Plan Width": 320,
          "Actual Startup Time": 456.123,
          "Actual Total Time": 1198.456,
          "Actual Rows": 8750,
          "Actual Loops": 1,
          "Hash Cond": "(a.id = b.account_id)",
          "Plans": [
            {
              "Node Type": "Bitmap Heap Scan",
              "Parent Relationship": "Outer",
              "Relation Name": "accounts",
              "Alias": "a",
              "Startup Cost": 215.45,
              "Total Cost": 8500.00,
              "Plan Rows": 12000,
              "Plan Width": 180,
              "Actual Startup Time": 12.345,
              "Actual Total Time": 234.567,
              "Actual Rows": 11850,
              "Actual Loops": 1,
              "Recheck Cond": "(region = 'MSK')",
              "Rows Removed by Index Recheck": 150,
              "Exact Heap Blocks": 1024,
              "Lossy Heap Blocks": 12,
              "Shared Hit Blocks": 856,
              "Shared Read Blocks": 180,
              "Plans": [
                {
                  "Node Type": "Bitmap Index Scan",
                  "Parent Relationship": "Outer",
                  "Index Name": "idx_accounts_region",
                  "Startup Cost": 0.00,
                  "Total Cost": 215.45,
                  "Plan Rows": 12000,
                  "Plan Width": 0,
                  "Actual Startup Time": 8.901,
                  "Actual Total Time": 8.901,
                  "Actual Rows": 12000,
                  "Actual Loops": 1,
                  "Index Cond": "(region = 'MSK')"
                }
              ]
            },
            {
              "Node Type": "Hash",
              "Parent Relationship": "Inner",
              "Startup Cost": 15000.00,
              "Total Cost": 15000.00,
              "Plan Rows": 500000,
              "Plan Width": 140,
              "Actual Startup Time": 432.100,
              "Actual Total Time": 432.100,
              "Actual Rows": 487650,
              "Actual Loops": 1,
              "Hash Buckets": 524288,
              "Hash Batches": 4,
              "Peak Memory Usage": 32768,
              "Plans": [
                {
                  "Node Type": "Seq Scan",
                  "Parent Relationship": "Outer",
                  "Relation Name": "billing_records",
                  "Alias": "b",
                  "Startup Cost": 0.00,
                  "Total Cost": 15000.00,
                  "Plan Rows": 500000,
                  "Plan Width": 140,
                  "Actual Startup Time": 0.015,
                  "Actual Total Time": 312.456,
                  "Actual Rows": 487650,
                  "Actual Loops": 1,
                  "Shared Hit Blocks": 1200,
                  "Shared Read Blocks": 6800
                }
              ]
            }
          ]
        }
      ]
    },
    "Planning Time": 3.456,
    "Triggers": [],
    "Execution Time": 1252.345
  }
]
