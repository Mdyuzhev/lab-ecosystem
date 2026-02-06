"""
Генератор данных биллинга за Q4 2025.
Создаёт billing_q4_2025.csv с ~5000-5500 записями.
"""

import os
import random
from datetime import date, timedelta

import pandas as pd
from shared_clients import get_or_create_clients

random.seed(42)

TARIFF_PRICES = {
    'Домашний-100': (550, 750),
    'Домашний-300': (800, 1100),
    'Домашний-500': (1200, 1600),
    'Игровой': (1400, 1900),
    'Всё включено': (1800, 2500),
    'Бизнес-100': (3000, 5000),
    'Бизнес-500': (8000, 12000),
    'Бизнес-1000': (15000, 20000),
    'Корпоративный': (25000, 40000),
    'Корпоративный+': (50000, 80000),
}

PERIODS = ['2025-10', '2025-11', '2025-12']


def _phone_alt_format(phone: str) -> str:
    """Переформатирует телефон в другой формат для аномалий."""
    digits = ''.join(c for c in phone if c.isdigit())  # 7903XXXXXXX
    fmt = random.choice(['8format', 'no_parens', 'spaces'])
    if fmt == '8format':
        return '8' + digits[1:]  # 8903XXXXXXX
    elif fmt == 'no_parens':
        return digits[:4] + digits[4:7] + '-' + digits[7:9] + '-' + digits[9:]
    else:
        return f'+7 {digits[1:4]} {digits[4:7]} {digits[7:9]} {digits[9:]}'


def _generate_orphan_accounts(n=25) -> list:
    """Генерирует счета-сироты (нет в CRM)."""
    orphans = []
    for _ in range(n):
        region_code = random.choice(['77', '78', '54', '66', '16', '52', '61'])
        acc = f'ЛС-{region_code}' + ''.join([str(random.randint(0, 9)) for _ in range(7)])
        tariff = random.choice(list(TARIFF_PRICES.keys()))
        orphans.append({
            'account_number': acc,
            'tariff': tariff,
            'inn': None,
            'phone': None,
            'status': 'closed',
        })
    return orphans


def generate_billing():
    clients = get_or_create_clients()

    rows = []
    stats = {
        'orphans': 0,
        'duplicates': 0,
        'negative_charges': 0,
        'null_phone': 0,
        'null_inn': 0,
        'alt_phone_format': 0,
        'inn_trimmed': 0,
        'debtors': 0,
    }

    # Собрать все лицевые счета
    account_records = []
    for client in clients:
        for acc in client['accounts']:
            account_records.append({
                'account_number': acc,
                'tariff': client['tariff'],
                'inn': client['inn'],
                'phone': client['phone'],
                'segment': client['segment'],
            })

    total_accounts = len(account_records)

    # Определить аномалии заранее
    phone_alt_indices = set(random.sample(range(total_accounts), int(total_accounts * 0.3)))
    null_phone_indices = set(random.sample(range(total_accounts), min(25, total_accounts)))
    null_inn_indices = set(random.sample(range(total_accounts), min(13, total_accounts)))
    inn_trim_candidates = [i for i, r in enumerate(account_records) if r['inn'] and r['inn'].startswith(('0', '1', '2'))]
    inn_trim_indices = set(random.sample(inn_trim_candidates, min(6, len(inn_trim_candidates)))) if inn_trim_candidates else set()

    # Статус аккаунтов
    statuses = []
    for _ in range(total_accounts):
        r = random.random()
        if r < 0.90:
            statuses.append('active')
        elif r < 0.97:
            statuses.append('suspended')
        else:
            statuses.append('closed')

    # Счета для дублей по периоду
    dup_account_indices = random.sample(range(total_accounts), min(8, total_accounts))

    # Генерация записей
    for idx, rec in enumerate(account_records):
        acc = rec['account_number']
        tariff = rec['tariff']
        inn = rec['inn']
        phone = rec['phone']
        status = statuses[idx]

        # Аномалии телефона
        if idx in null_phone_indices:
            phone = None
            stats['null_phone'] += 1
        elif idx in phone_alt_indices:
            phone = _phone_alt_format(phone)
            stats['alt_phone_format'] += 1

        # Аномалии ИНН
        if idx in null_inn_indices:
            inn = None
            stats['null_inn'] += 1
        elif idx in inn_trim_indices:
            inn = inn.lstrip('0') if inn else inn
            stats['inn_trimmed'] += 1

        price_range = TARIFF_PRICES.get(tariff, (500, 1000))
        balance = 0.0

        for period in PERIODS:
            charged = round(random.uniform(*price_range), 2)

            # 5% — переплата, 15% — недоплата/ноль, 80% — полная
            pay_roll = random.random()
            if pay_roll < 0.05:
                paid = round(charged * random.uniform(1.01, 1.5), 2)
            elif pay_roll < 0.20:
                paid = round(charged * random.uniform(0.0, 0.6), 2) if random.random() > 0.3 else 0.0
            else:
                paid = charged

            balance = round(balance + paid - charged, 2)

            # Дата платежа
            if paid > 0:
                month_num = int(period.split('-')[1])
                pay_day = random.randint(1, 28)
                last_payment_date = date(2025, month_num, pay_day).isoformat()
            else:
                if random.random() < 0.5:
                    last_payment_date = None
                else:
                    old_date = date(2025, random.randint(1, 9), random.randint(1, 28))
                    last_payment_date = old_date.isoformat()

            rows.append({
                'account_number': acc,
                'period': period,
                'tariff': tariff,
                'charged_amount': charged,
                'paid_amount': paid,
                'balance': balance,
                'last_payment_date': last_payment_date,
                'inn': inn,
                'phone': phone,
                'status': status,
            })

        if balance < 0:
            stats['debtors'] += 1

    # Дубли по периоду
    for dup_idx in dup_account_indices:
        rec = account_records[dup_idx]
        period = random.choice(PERIODS)
        price_range = TARIFF_PRICES.get(rec['tariff'], (500, 1000))

        # Сторно + повторное начисление
        charged_storno = -round(random.uniform(*price_range), 2)
        rows.append({
            'account_number': rec['account_number'],
            'period': period,
            'tariff': rec['tariff'],
            'charged_amount': charged_storno,
            'paid_amount': 0.0,
            'balance': charged_storno,
            'last_payment_date': None,
            'inn': rec['inn'],
            'phone': rec['phone'],
            'status': 'active',
        })
        stats['duplicates'] += 1
        stats['negative_charges'] += 1

    # Счета-сироты
    orphans = _generate_orphan_accounts(25)
    stats['orphans'] = len(orphans)
    for orph in orphans:
        for period in PERIODS:
            price_range = TARIFF_PRICES.get(orph['tariff'], (500, 1000))
            charged = round(random.uniform(*price_range), 2)
            rows.append({
                'account_number': orph['account_number'],
                'period': period,
                'tariff': orph['tariff'],
                'charged_amount': charged,
                'paid_amount': 0.0,
                'balance': -charged,
                'last_payment_date': None,
                'inn': orph['inn'],
                'phone': orph['phone'],
                'status': orph['status'],
            })

    # Дополнительные отрицательные начисления (корректировки)
    for _ in range(4):
        rec = random.choice(account_records)
        period = random.choice(PERIODS)
        rows.append({
            'account_number': rec['account_number'],
            'period': period,
            'tariff': rec['tariff'],
            'charged_amount': -round(random.uniform(100, 2000), 2),
            'paid_amount': 0.0,
            'balance': 0.0,
            'last_payment_date': None,
            'inn': rec['inn'],
            'phone': rec['phone'],
            'status': 'active',
        })
        stats['negative_charges'] += 1

    df = pd.DataFrame(rows)
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, 'billing_q4_2025.csv')
    df.to_csv(output_path, sep=';', index=False, encoding='utf-8-sig')

    file_size = os.path.getsize(output_path) / (1024 * 1024)

    print('=== Генерация биллинга Q4 2025 ===')
    print(f'Всего лицевых счетов: {total_accounts}')
    print(f'Записей (счёт x месяц): {len(rows)}')
    print(f'Счета-сироты: {stats["orphans"]}')
    print(f'Дубли по периоду: {stats["duplicates"]}')
    print(f'Отрицательные начисления: {stats["negative_charges"]}')
    print(f'Пустой телефон: {stats["null_phone"]}')
    print(f'Пустой ИНН: {stats["null_inn"]}')
    print(f'ИНН обрезан: {stats["inn_trimmed"]}')
    print(f'Формат телефона отличается: {stats["alt_phone_format"]}')
    print(f'Должники (balance < 0): {stats["debtors"]}')
    print(f'Файл: {output_path} ({file_size:.1f} MB)')


if __name__ == '__main__':
    generate_billing()
