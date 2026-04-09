# API 명세서

## AUTH (인증)
| API ID | 기능명 | Method | URL | 설명 |
|--------|--------|--------|-----|------|
| AUTH-01 | 로그인(조회) | POST | /api/auth/login | (body) email, password 전달하여 로그인 상태 검증 |
| AUTH-02 | 로그아웃 | POST | /api/auth/logout | |

## USERS (회원)
| API ID | 기능명 | Method | URL | 설명 |
|--------|--------|--------|-----|------|
| USER-01 | 중복가입 조회(내정보) | GET | /api/users | (query) ?email={email} 로 가입여부 확인 |
| USER-02 | 회원가입 | POST | /api/users | (body) name, email, password 받기 |
| USER-03 | 내정보 변경 | PATCH | /api/users | 비밀번호, 이메일 변경만 허용, 이름 바꾸기 불가 |
| USER-04 | 회원탈퇴 | DELETE | /api/users | |

## TRAVELS (여행)
| API ID | 기능명 | Method | URL | 설명 |
|--------|--------|--------|-----|------|
| TRAVEL-01 | 여행 목록 조회 | GET | /api/travels | 그룹 전체 검색하기 |
| TRAVEL-02 | 여행 상세 조회 | GET | /api/travels/{id} | 그룹 완원·코드 확인할때 |
| TRAVEL-03 | 여행 상세 내역 수정 | PATCH | /api/travels/{id} | 그룹 명 수정, 멤버 수정 |
| TRAVEL-04 | 여행 삭제 | DELETE | /api/travels/{id} | |
| Main-01 | 여행목록조회 | GET | /api/travels/{id} | |
| Main-03 | 여행생성 | POST | /api/travels | |
| Main-04 | 여행삭제 | DELETE | /api/travels/{id} | |
| MAIN2-1 | 여행상세조회(상단) | GET | /api/travels/{id} | |
| MAIN2-2-1 | 1인당 예산, Day 조회 카테고리별 지출금액 | GET | /api/expenses/{travelId} | |
| MAIN2-2-2 | 1인당 예산, Day 수정 | PATCH | /api/expenses/{travelId} | |
| MAIN2-3 | 최근 지출목록 3건 | GET | /api/expenses/{travelId} | &_sort=-date&_limit=3 |

## EXPENSES (지출)
| API ID | 기능명 | Method | URL | 설명 |
|--------|--------|--------|-----|------|
| EXPENSESLIST | 지출 내역 목록 조회 | GET | /api/expenses | |
| EXP-01 | 지출 기록 생성 | POST | /api/expenses | (body) data, category, amount, memberids, photos 전달하여 지출 생성 |
| EXP-02 | 영수증 이미지 업로드 | POST | /api/expenses/{expenseId}/receipt | (body) multipart/form-data 형식으로 image 파일 전달 |
| EXP-03 | 카테고리 목록 조회 | GET | /api/categories | (response) id, name, icon 목록 반환 |
| EXP-04 | 지출 내역 수정 | PUT | /api/expenses/{expenseId} | |
| EXP-05 | 지출 내역 삭제 | DELETE | /api/expenses/{expenseId} | |
| EXP-06 | 계산자 + 멤버 목록 조회 | GET | /api/users | |

## SETTLEMENT (정산)
| API ID | 기능명 | Method | URL | 설명 |
|--------|--------|--------|-----|------|
| SET-01 | 여행별 정산 조회 | GET | /api/settlements | ?travelId={travelId} 쿼리파라미터 |
| SET-02 | 정산 생성 | POST | /api/settlements | 정산이 없다면, 초기생성 |
| SET-03 | 정산 상태 변경 | PATCH | /api/settlements/{settlementId} | 정산의 상태를 3가지로 관리(pending, requested, completed) |
