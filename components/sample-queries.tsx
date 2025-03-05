import { Button } from "@/components/ui/button"

interface SampleQueriesProps {
  onSelectQuery: (query: string) => void
}

export function SampleQueries({ onSelectQuery }: SampleQueriesProps) {
  const sampleQueries = [
    {
      name: "Create Users Table",
      query: `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    },
    {
      name: "Insert Sample Data",
      query: `INSERT INTO users (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Bob Johnson', 'bob@example.com');`,
    },
    {
      name: "Select All Users",
      query: `SELECT * FROM users;`,
    },
    {
      name: "SQLite Version",
      query: `SELECT sqlite_version();`,
    },
    {
      name: "List All Tables",
      query: `SELECT name FROM sqlite_master WHERE type='table';`,
    },
  ]

  return (
    <div className="space-y-2">
      {sampleQueries.map((sample, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full justify-start text-left"
          onClick={() => onSelectQuery(sample.query)}
        >
          {sample.name}
        </Button>
      ))}
    </div>
  )
}

