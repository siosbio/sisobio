# 🎨 Favicon 생성 가이드

시소바이오 홈페이지를 위한 Favicon 파일 생성 가이드입니다.

---

## 📋 필요한 Favicon 파일 목록

### 1. **필수 파일** (우선순위 순)

| 파일명 | 사이즈 | 형식 | 용도 | 생성방법 |
|--------|--------|------|------|----------|
| `favicon.svg` | Scalable | SVG | 모던 브라우저 | logo.svg를 단순화 |
| `favicon-32x32.png` | 32×32px | PNG | 브라우저 탭 | logo.svg → PNG 변환 |
| `favicon-16x16.png` | 16×16px | PNG | 작은 탭 | logo.svg → PNG 변환 |
| `apple-touch-icon.png` | 180×180px | PNG | iOS 홈화면 | logo.svg → PNG 변환 |
| `android-chrome-192x192.png` | 192×192px | PNG | Android | logo.svg → PNG 변환 |
| `android-chrome-512x512.png` | 512×512px | PNG | Android Splash | logo.svg → PNG 변환 |

### 2. **선택 파일** (더 나은 호환성)

| 파일명 | 사이즈 | 형식 | 용도 |
|--------|--------|------|------|
| `favicon.ico` | 32×32px | ICO | IE 대체 |

---

## 🛠️ Favicon 생성 방법

### **옵션 1: 온라인 도구 사용 (가장 쉬움) ⭐**

#### **추천 사이트**:
1. **[Favicon.io](https://favicon.io/)** (무료)
   - logo.svg 업로드
   - 모든 사이즈 자동 생성
   - ZIP으로 다운로드

2. **[RealFaviconGenerator](https://realfavicongenerator.net/)** (무료)
   - 가장 포괄적
   - 미리보기 제공
   - PWA 설정 포함

#### **사용 방법**:
```bash
1. https://favicon.io/ 접속
2. "Upload an Image" 선택
3. logo.svg 업로드
4. "Download" 클릭
5. 생성된 파일들을 /homepage/ 루트에 복사
```

---

### **옵션 2: Figma에서 직접 생성**

#### **1. favicon.svg 생성**
```
1. Figma에서 logo 선택
2. 단순화 (불필요한 요소 제거)
3. Export → SVG
4. 파일명: favicon.svg
```

#### **2. PNG 파일 생성**
```
각 사이즈별로 Export:
- 16×16px → favicon-16x16.png
- 32×32px → favicon-32x32.png
- 180×180px → apple-touch-icon.png
- 192×192px → android-chrome-192x192.png
- 512×512px → android-chrome-512x512.png
```

**Figma Export 설정**:
- Format: PNG
- Scale: 1x (각 사이즈 정확히)
- Background: Transparent (투명)

---

### **옵션 3: 로고에서 자동 변환 (CLI)**

```bash
# ImageMagick 설치 (Mac)
brew install imagemagick

# SVG → PNG 변환
convert logo.svg -resize 32x32 favicon-32x32.png
convert logo.svg -resize 16x16 favicon-16x16.png
convert logo.svg -resize 180x180 apple-touch-icon.png
convert logo.svg -resize 192x192 android-chrome-192x192.png
convert logo.svg -resize 512x512 android-chrome-512x512.png

# favicon.svg는 logo.svg를 단순화해서 복사
cp logo.svg favicon.svg
```

---

## 📁 파일 위치

모든 Favicon 파일은 **홈페이지 루트**에 위치해야 합니다:

```
homepage/
├── favicon.svg ⭐
├── favicon-32x32.png ⭐
├── favicon-16x16.png ⭐
├── apple-touch-icon.png ⭐
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── site.webmanifest ✅ (이미 생성됨)
└── index.html
```

---

## ✅ HTML 설정 (이미 완료)

`index.html`에 이미 다음 코드가 추가되어 있습니다:

```html
<!-- Favicons -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

---

## 🎨 디자인 가이드라인

### **Favicon 디자인 원칙**:

1. **단순함** ⭐
   - 16×16px에서도 식별 가능해야 함
   - 복잡한 디테일 제거
   - 핵심 형태만 유지

2. **대비**
   - Light/Dark 테마 모두 고려
   - 배경: 투명 (Transparent)
   - 테두리: 선택적 추가

3. **브랜드 색상**
   - Primary: `#0066CC` (Ocean Blue)
   - 단색 또는 2색 이내

### **예시 구성**:
```
Option 1: 로고 심볼만 (추천)
- "S" 글자 또는 물결 심볼
- 단색 파란색

Option 2: 로고 전체 단순화
- 텍스트 제거
- 아이콘만 남김

Option 3: 원형 배경
- 파란 원 + 흰색 심볼
```

---

## 🧪 테스트 방법

### **1. 로컬 테스트**
```bash
# 로컬 서버 실행
cd /Users/anhongje/mcpdoc/outsourcing/sisobio/homepage
python3 -m http.server 8000

# 브라우저에서 확인
http://localhost:8000
```

### **2. 브라우저 탭 확인**
- Chrome: 탭에 favicon 표시 확인
- Safari: 탭에 favicon 표시 확인
- Firefox: 탭에 favicon 표시 확인

### **3. 모바일 확인**
- iOS Safari: "홈 화면에 추가" → 아이콘 확인
- Android Chrome: "홈 화면에 추가" → 아이콘 확인

---

## 📊 체크리스트

파일 생성 후 확인:

- [ ] `favicon.svg` (SVG 최적화)
- [ ] `favicon-32x32.png` (32×32px PNG)
- [ ] `favicon-16x16.png` (16×16px PNG)
- [ ] `apple-touch-icon.png` (180×180px PNG)
- [ ] `android-chrome-192x192.png` (192×192px PNG)
- [ ] `android-chrome-512x512.png` (512×512px PNG)
- [ ] `site.webmanifest` ✅ (완료)
- [ ] 파일 위치: `/homepage/` 루트
- [ ] 브라우저 탭 테스트
- [ ] 모바일 홈화면 테스트

---

## 🚀 빠른 시작 (권장)

**가장 빠른 방법**:

1. [https://favicon.io/](https://favicon.io/) 접속
2. logo.svg 업로드
3. 생성된 파일 다운로드
4. `/homepage/` 루트에 복사
5. 브라우저 새로고침 (Ctrl+F5)

**완료!** 🎉

---

## 📚 참고 자료

- [Favicon Generator](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Web.dev - Add a web app manifest](https://web.dev/add-manifest/)
- [Apple Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/)

---

**작성일**: 2025-10-29  
**프로젝트**: Sisobio Corporate Website  
**담당자**: 박디자인 (UI/UX Designer)
