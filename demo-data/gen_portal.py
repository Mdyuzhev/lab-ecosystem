"""
Генератор активности личного кабинета за Q4 2025.
Создаёт portal_activity_q4_2025.csv с ~900-1000 записями.
"""

import os
import random
from datetime import date, timedelta

import pandas as pd
from faker import Faker
from shared_clients import get_or_create_clients

random.seed(42)
Faker.seed(42)
fake = Faker('ru_RU')

SERVICES = ['Интернет', 'ТВ', 'Телефония', 'Облако', 'VPN', 'Антивирус']
GARBAGE_NAMES = ['test', 'qwerty', '123', 'Я', 'asdf', 'ааа', 'user', 'тест', '111', 'йцукен', 'Клиент', 'Имя', '---', '...']


def generate_portal():
    clients = get_or_create_clients()

    rows = []
    stats = {
        'total_registered': 0,
        'b2b_registered': 0,
        'b2c_registered': 0,
        'login_not_email': 0,
        'no_account': 0,
        'multi_lk': 0,
        'garbage_name': 0,
        'wrong_portal': 0,
        'dead_accounts': 0,
        'active_no_pay': 0,
    }

    b2b_clients = [c for c in clients if c['segment'] == 'B2B']
    b2c_clients = [c for c in clients if c['segment'] == 'B2C']

    # 85% B2B и 75% B2C зарегистрированы
    registered_b2b = random.sample(b2b_clients, int(len(b2b_clients) * 0.85))
    registered_b2c = random.sample(b2c_clients, int(len(b2c_clients) * 0.75))

    stats['b2b_registered'] = len(registered_b2b)
    stats['b2c_registered'] = len(registered_b2c)

    # Индексы для аномалий
    all_registered = registered_b2b + registered_b2c
    stats['total_registered'] = len(all_registered)

    login_not_email_indices = set(random.sample(range(len(all_registered)), int(len(all_registered) * 0.10)))
    no_account_indices = set(random.sample(range(len(all_registered)), min(18, len(all_registered))))
    garbage_name_indices = set(random.sample(range(len(all_registered)), min(13, len(all_registered))))
    wrong_portal_indices = set(random.sample(
        [i for i, c in enumerate(all_registered) if c['segment'] == 'B2C'],
        min(6, len(registered_b2c))
    ))
    dead_account_indices = set(random.sample(range(len(all_registered)), min(35, len(all_registered))))

    # Клиенты для мульти-ЛК
    multi_lk_indices = random.sample(range(len(all_registered)), min(12, len(all_registered)))

    for idx, client in enumerate(all_registered):
        segment = client['segment']
        email = client['email']
        phone = client['phone']
        accounts = client['accounts']

        # Логин
        if idx in login_not_email_indices:
            digits = ''.join(c for c in phone if c.isdigit())
            user_login = digits
            stats['login_not_email'] += 1
        else:
            user_login = email

        # Портал
        portal_type = 'b2b' if segment == 'B2B' else 'b2c'
        if idx in wrong_portal_indices:
            portal_type = 'b2b'
            stats['wrong_portal'] += 1

        # Лицевой счёт
        account_number = random.choice(accounts) if accounts else None
        if idx in no_account_indices:
            account_number = None
            stats['no_account'] += 1

        # Отображаемое имя
        if idx in garbage_name_indices:
            display_name = random.choice(GARBAGE_NAMES)
            stats['garbage_name'] += 1
        else:
            display_name = client['contact_name']

        # Дата регистрации
        reg_start = date(2020, 1, 1)
        reg_end = date(2025, 9, 30)
        registered_date = reg_start + timedelta(days=random.randint(0, (reg_end - reg_start).days))

        # Активность
        is_dead = idx in dead_account_indices and registered_date < date(2023, 1, 1)
        if is_dead:
            stats['dead_accounts'] += 1
            last_login_date = registered_date + timedelta(days=random.randint(0, 180))
            if last_login_date > date(2025, 12, 28):
                last_login_date = date(2025, 6, 15)
            logins_q4 = 0
            tickets_q4 = 0
            payments_q4 = 0
        else:
            activity_roll = random.random()
            if activity_roll < 0.60:
                # Активный в Q4
                last_login_date = date(2025, random.randint(10, 12), random.randint(1, 28))
                logins_q4 = max(1, int(random.expovariate(0.1)))
                if logins_q4 > 50:
                    logins_q4 = 50
            elif activity_roll < 0.85:
                # Логинился давно
                last_login_date = date(2025, random.randint(4, 9), random.randint(1, 28))
                logins_q4 = 0
            else:
                # Ни разу за полгода
                last_login_date = date(2024, random.randint(1, 12), random.randint(1, 28))
                logins_q4 = 0

            # Тикеты
            ticket_roll = random.random()
            if ticket_roll < 0.70:
                tickets_q4 = 0
            elif ticket_roll < 0.90:
                tickets_q4 = random.randint(1, 3)
            else:
                tickets_q4 = random.randint(4, 12)

            # Оплаты
            if logins_q4 > 0:
                if random.random() < 0.15:
                    payments_q4 = 0
                    if logins_q4 > 3 and tickets_q4 > 0:
                        stats['active_no_pay'] += 1
                else:
                    payments_q4 = random.randint(1, min(logins_q4, 6))
            else:
                payments_q4 = 0

        # Услуги
        n_services = random.randint(1, 4)
        services = ';'.join(random.sample(SERVICES, n_services))

        rows.append({
            'user_login': user_login,
            'portal_type': portal_type,
            'account_number': account_number,
            'display_name': display_name,
            'email': email,
            'phone': phone,
            'last_login_date': last_login_date.isoformat(),
            'logins_count_q4': logins_q4,
            'tickets_count_q4': tickets_q4,
            'payments_online_q4': payments_q4,
            'services_active': services,
            'registered_date': registered_date.isoformat(),
        })

    # Мульти-ЛК (дублирующие аккаунты)
    for dup_idx in multi_lk_indices:
        client = all_registered[dup_idx]
        original_row = rows[dup_idx].copy()
        # Новый аккаунт — зарегистрировался заново
        original_row['user_login'] = client['email'] if rows[dup_idx]['user_login'] != client['email'] else \
            ''.join(c for c in client['phone'] if c.isdigit())
        original_row['display_name'] = random.choice(GARBAGE_NAMES)
        original_row['registered_date'] = date(2025, random.randint(7, 12), random.randint(1, 28)).isoformat()
        original_row['logins_count_q4'] = random.randint(1, 5)
        original_row['last_login_date'] = date(2025, random.randint(10, 12), random.randint(1, 28)).isoformat()
        rows.append(original_row)
        stats['multi_lk'] += 1

    random.shuffle(rows)

    df = pd.DataFrame(rows)
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, 'portal_activity_q4_2025.csv')
    df.to_csv(output_path, sep=';', index=False, encoding='utf-8-sig')

    file_size = os.path.getsize(output_path) / (1024 * 1024)

    print('=== Генерация активности ЛК Q4 2025 ===')
    print(f'Зарегистрировано: {stats["total_registered"]} (B2B: {stats["b2b_registered"]}, B2C: {stats["b2c_registered"]})')
    print(f'Логин != email: {stats["login_not_email"]}')
    print(f'Без лицевого счёта: {stats["no_account"]}')
    print(f'Мульти-ЛК (дубли): {stats["multi_lk"]}')
    print(f'Кривое имя (garbage): {stats["garbage_name"]}')
    print(f'Портал B2B для B2C: {stats["wrong_portal"]}')
    print(f'Мёртвые аккаунты: {stats["dead_accounts"]}')
    print(f'Активные без оплат: {stats["active_no_pay"]}')
    print(f'Итого записей: {len(rows)}')
    print(f'Файл: {output_path} ({file_size:.2f} MB)')


if __name__ == '__main__':
    generate_portal()
