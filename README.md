# To-Do LIst Application

## UI Library
- ShadCN + TailwindCSS
    - 최신 감각의 모던한 UI
    - 필요한 컴포넌트만 install 해서 사용 가능
    - TailwindCSS와 조합하여 빠르게 스타일링 가능
    - Card, Button, Input 등 기본적인 To-Do 기능에 최적화

## Features
- 화면 상단에서 신규 To-Do 입력하여 목록에 추가할 수 있습니다.
    - 내용 및 기한(날짜) 입력이 가능합니다.
- Row 단위로 선택하여 수정이 가능합니다.
- 항목 별 완료 처리가 가능하고 완료된 항목에 대해 인지할 수 있도록 표시합니다.
- Multiple Row 선택 후 삭제가 가능합니다.
- 기한이 3일 이내로 남은 경우 사용자가 인지할 수 있도록 표시합니다.
- List는 Page Size 5, 10, 20 중 선택하여 페이지로 표시하였습니다. 
- 리스트 내에서 검색 기능을 제공합니다. (검색 키워드는 브라우저를 다시 열었을 때 유지됩니다.)
    - 검색은 내용, 기한, 상태로 가능합니다. 

## Structure
📦 TODO-APP
├── 📂 cypress (e2e 테스트)
├── 📂 src
│   ├── 📂 api (axios 요청)
│   ├── 📂 components
│   │   ├── 📂 ui (UI 컴포넌트)
│   │   ├── 📂 pages/Home (Container 수준 컴포넌트)
│   ├── 📂 hooks (custom hook)
│   ├── 📂 libs 
│   ├── 📂 mocks
│   ├── 📂 pages (Page 수준 컴포넌트)
│   ├── 📂 types 
├── 📂 public
├── package.json
├── ...
├── README.md



