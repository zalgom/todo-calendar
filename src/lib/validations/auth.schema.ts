/**
 * 인증 관련 Zod 유효성 검사 스키마
 */
import { z } from 'zod'

// 로그인 스키마
export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

// 회원가입 스키마 (로그인 스키마 확장)
export const signupSchema = loginSchema
  .extend({
    passwordConfirm: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
