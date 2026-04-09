# 컨벤션

## 📌 브랜치 이름 규칙

| 타입 | 형식 | 예시 |
|------|------|------|
| 기능 개발 | feature/기능명 | feature/expenses |
| 버그 수정 | fix/버그내용 | fix/login-error |
| 긴급 수정 | hotfix/내용 | hotfix/crash |

---

## 📌 커밋 메시지 규칙

| 타입 | 설명 | 예시 |
|------|------|------|
| feat | 새 기능 추가 | feat: 지출 기록 페이지 구현 |
| fix | 버그 수정 | fix: 완료 버튼 이동 경로 수정 |
| docs | 문서 수정 | docs: README 수정 |
| style | 코드 스타일 수정 | style: 로그인 페이지 디자인 통일 |
| refactor | 코드 리팩토링 | refactor: useExpense 훅 분리 |
| chore | 기타 작업 | chore: json-server 설치 |

---

## 📌 PR 규칙

- base 브랜치: `main`
- PR 제목은 커밋 메시지 규칙과 동일하게 작성
- 머지 전 팀원에게 공유 후 머지
- 머지 후 팀원들은 `git pull origin main` 실행

---

## 📌 코드 스타일

- 들여쓰기: 2칸
- 따옴표: 작은따옴표 사용
- 세미콜론: 사용하지 않음
- 컴포넌트 파일명: PascalCase (예: `ExpenseRecord.vue`)
- 함수명/변수명: camelCase (예: `handleComplete`, `saveExpense`)
