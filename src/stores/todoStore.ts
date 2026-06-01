/**
 * 투두 Zustand 스토어
 * - 투두 목록 상태 관리
 * - 낙관적 업데이트 지원
 */
import { create } from 'zustand'
import type { Todo } from '@/types'

interface TodoState {
  // 현재 선택된 날짜의 투두 목록
  todos: Todo[]
  // 로딩 상태
  isLoading: boolean
  // 에러 메시지
  error: string | null
  // 현재 편집 중인 투두 ID
  editingTodoId: string | null
}

interface TodoActions {
  // 전체 투두 목록 설정 (날짜별 조회 후 세팅)
  setTodos: (todos: Todo[]) => void
  // 단일 투두 추가
  addTodo: (todo: Todo) => void
  // 투두 업데이트 (낙관적 업데이트 후 서버 응답으로 확정)
  updateTodo: (id: string, updates: Partial<Todo>) => void
  // 투두 삭제
  removeTodo: (id: string) => void
  // 로딩 상태 설정
  setLoading: (isLoading: boolean) => void
  // 에러 설정
  setError: (error: string | null) => void
  // 편집 중인 투두 ID 설정
  setEditingTodoId: (id: string | null) => void
  // 상태 초기화 (날짜 변경 시)
  reset: () => void
}

type TodoStore = TodoState & TodoActions

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  error: null,
  editingTodoId: null,
}

export const useTodoStore = create<TodoStore>((set) => ({
  ...initialState,

  setTodos: (todos) => set({ todos }),

  addTodo: (todo) =>
    set((state) => ({
      todos: [todo, ...state.todos],
    })),

  updateTodo: (id, updates) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    })),

  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setEditingTodoId: (editingTodoId) => set({ editingTodoId }),

  reset: () => set(initialState),
}))
