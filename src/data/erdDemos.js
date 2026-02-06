export const demoEcommerce = `
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    sku VARCHAR(50) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','paid','shipped','delivered','cancelled')),
    total_amount NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT NOW(),
    shipped_at TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
`;

export const demoTelecom = `
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE tariffs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    segment VARCHAR(10) NOT NULL CHECK (segment IN ('B2B', 'B2C')),
    monthly_fee NUMERIC(10,2) NOT NULL,
    speed_mbps INTEGER,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    segment VARCHAR(10) NOT NULL CHECK (segment IN ('B2B', 'B2C')),
    company_name VARCHAR(300),
    contact_name VARCHAR(200) NOT NULL,
    inn VARCHAR(12),
    phone VARCHAR(20),
    email VARCHAR(255),
    region_id INTEGER REFERENCES regions(id),
    manager_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    tariff_id INTEGER NOT NULL REFERENCES tariffs(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','suspended','closed')),
    activated_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP
);

CREATE TABLE billing_records (
    id BIGSERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    period DATE NOT NULL,
    charged_amount NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    balance NUMERIC(12,2),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(30),
    payment_date TIMESTAMP NOT NULL,
    external_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    account_id INTEGER REFERENCES accounts(id),
    subject VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
    priority VARCHAR(10) DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_region ON clients(region_id);
CREATE INDEX idx_clients_inn ON clients(inn);
CREATE INDEX idx_accounts_client ON accounts(client_id);
CREATE INDEX idx_accounts_tariff ON accounts(tariff_id);
CREATE INDEX idx_billing_account ON billing_records(account_id);
CREATE INDEX idx_billing_period ON billing_records(period);
CREATE INDEX idx_payments_account ON payments(account_id);
CREATE INDEX idx_tickets_client ON support_tickets(client_id);
CREATE INDEX idx_audit_table ON audit_log(table_name, record_id);
`;

export const demoHR = `
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    parent_id INTEGER REFERENCES departments(id),
    head_employee_id INTEGER
);

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    grade INTEGER CHECK (grade BETWEEN 1 AND 20),
    min_salary NUMERIC(12,2),
    max_salary NUMERIC(12,2)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    department_id INTEGER NOT NULL REFERENCES departments(id),
    position_id INTEGER NOT NULL REFERENCES positions(id),
    hire_date DATE NOT NULL,
    termination_date DATE,
    salary NUMERIC(12,2) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20)
);

ALTER TABLE departments ADD CONSTRAINT fk_dept_head
    FOREIGN KEY (head_employee_id) REFERENCES employees(id);

CREATE TABLE timesheets (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    work_date DATE NOT NULL,
    hours_worked NUMERIC(4,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft'
);

CREATE TABLE payroll (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    period DATE NOT NULL,
    base_salary NUMERIC(12,2),
    bonus NUMERIC(12,2) DEFAULT 0,
    deductions NUMERIC(12,2) DEFAULT 0,
    net_amount NUMERIC(12,2),
    paid_at TIMESTAMP
);

CREATE TABLE document_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE employee_documents (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    document_type_id INTEGER NOT NULL REFERENCES document_types(id),
    issue_date DATE,
    expiry_date DATE,
    file_path VARCHAR(500)
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE employee_skills (
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    level INTEGER CHECK (level BETWEEN 1 AND 5),
    PRIMARY KEY (employee_id, skill_id)
);

CREATE TABLE orphan_table (
    id SERIAL PRIMARY KEY,
    data TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
`;
