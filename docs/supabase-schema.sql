-- ============================================
-- 투두 캘린더 Supabase 데이터베이스 스키마
-- ============================================
-- Supabase Dashboard → SQL Editor에서 이 전체 내용을 복사 & 실행하세요

-- 1. profiles 테이블 생성
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now()
);

-- 2. todos 테이블 생성
create table if not exists todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  is_completed boolean default false,
  due_date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. 인덱스 생성 (성능 최적화)
create index if not exists todos_user_date_idx on todos(user_id, due_date);

-- 4. RLS(Row Level Security) 활성화
alter table todos enable row level security;

-- 5. RLS 정책: SELECT (본인 데이터만 조회)
create policy "사용자 본인 투두만 조회"
  on todos for select
  using (auth.uid() = user_id);

-- 6. RLS 정책: INSERT (본인 데이터만 생성)
create policy "사용자 본인 투두만 생성"
  on todos for insert
  with check (auth.uid() = user_id);

-- 7. RLS 정책: UPDATE (본인 데이터만 수정)
create policy "사용자 본인 투두만 수정"
  on todos for update
  using (auth.uid() = user_id);

-- 8. RLS 정책: DELETE (본인 데이터만 삭제)
create policy "사용자 본인 투두만 삭제"
  on todos for delete
  using (auth.uid() = user_id);

-- ============================================
-- 완료! 위 SQL을 모두 실행하면 DB 설정 완료됨
-- ============================================
