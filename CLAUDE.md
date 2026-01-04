<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>개발 규칙</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            background: white;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        li:before {
            content: "✓";
            color: #3498db;
            font-weight: bold;
            margin-right: 10px;
        }
        strong {
            color: #2980b9;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 개발 규칙</h1>

        <section>
            <h2>코드 작성 주의사항</h2>
            <ul>
                <li><strong>간략한 주석</strong> - 핵심 로직만</li>
                <li><strong>계획된 것만 구현</strong> - 추가 기능 작성 금지</li>
                <li><strong>성능 최적화</strong> - 불필요한 연산 제거</li>
                <li><strong>캐싱 활용</strong> - 처리된 데이터 재사용</li>
                <li><strong>불필요한 메서드 제거</strong> - 사용하지 않는 코드 정리</li>
                <li><strong>Find 계열 금지</strong> - FindObjectOfType 등 사용 금지</li>
                <li><strong>직접 참조 연결</strong> - SerializeField로 Inspector 연결</li>
                <li><strong>디버그 로그 금지</strong> - ContextMenu 메서드 제외</li>
            </ul>
        </section>

        <section>
            <h2>클로드 코드 개발 규칙</h2>
            <ul>
                <li><strong>계획 수립</strong> - 문제 분석 후 계획 작성</li>
                <li><strong>체크리스트 작성</strong> - 완료 표시 가능한 할 일 목록</li>
                <li><strong>계획 검증</strong> - 작업 전 사용자 승인</li>
                <li><strong>진행 상황 추적</strong> - TodoWrite로 항목 완료 표시</li>
                <li><strong>변경 사항 보고</strong> - 각 단계별 간략한 설명</li>
                <li><strong>단순함 유지</strong> - 간단하게, 영향 최소화</li>
            </ul>
        </section>
    </div>
</body>
</html>
