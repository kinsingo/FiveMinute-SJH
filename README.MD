## To-Do
1) App 부분에서, Explore Tab 에서 React-Native 의 Expo Router 등에 대해서 자세히 읽어보기
2) 1번이 끝나면, React-Native-Paper Docx 들어가서 React-Native-Paper 관련 example 하나의 Tab으로 구현 해보기 (expo router 이용)

## 250121
1) 근태 관리 부분 어느정도 구축 해놓음(Timepicker 로 근태 시간 수정가능하도록, 해당 수정 권한은 오로지 매니저에게만)

## 250131
1) Auth쪽 구현함. 이게 Token 관리 방식이 Web 과 App 같이 사용하면 꼬일수 있음. Web 은 기존 NextAuth, App은 JWT 방식 Backend API 적용

## 250202
1) 재고관리쪽 구현 완료

## 250203
1) Auth 쪽 Context 통해서 Login 상태 관리를 위한 잦은 Backend API 호출을 방지

## 250205
1) Firebase 의 DB 및 FileSystem 연동하여 지시사항 관련 기능 구축 완료 (추가(Image도 반영 가능)/수정/삭제/댓글 달기)

## 250206
1) 강남역/수내역 2가지 지점으로 지시사항 Collection 및 Page 따로 관리하도록 함
2) 지시사항 관련 댓글에 이미지 추가 및 삭제 기능 구축 완료(검증까지 완료)

## 250209
1) ibeacon E7 연동하여, 출/퇴근 지역에 따른 비콘 영역에서만 출/퇴근 가능하도록함 (bareWorkFlow 동작, five-min-RNP-bareWorkFlow 프로젝트 사용)

## 250210
1) 근태관리쪽에, 출/퇴근 시간 DB에 반영 및 업데이트 되도록 하였음 
   -. 한국 날자 기준으로 CheckIn/CheckOut 관리함
      (Checkout 안 했을때, 어떻위게 할지 ? Workhour ? 그대로 계산 안되도록?)
   -. 지역 구분 안하고 출/퇴근 가능하도록 함( 나중에 강남에서 출근하고, 수내에서 퇴근하게 되는 경우 가능하도록)

## 250212
1) 관악쪽도 연결 추가했고, 출/퇴근 데이터만 제대로 수집
2) user 뿐만 아니라 userInfo 추가해서, 계정관리 페이지 관리 되도록 하였음 (닉네임, 이름, 생년월일, 성별, 직책 등)
3) 재고관리/ToDo 쪽도 닉네임 있다면, 이메일 대신 닉네임 보여지도록 함
4) 댓글창 개선 많이 했음

## 250304
1) Android/ios별 지시사항 업로드시 Push 하도록 구현 완료

## To-Do
1) 더 필요한 기능 있는지 확인하고, 피드백 받아서 배포

## 중요[App]
1) Firebase 의 Firestore(Database) 에서는 아래 Rule 적용하여, 해당 Database는 보안이 떨어짐 
(Firestore는 클라이언트에서 직접 데이터를 가져오고 수정할 수 있기 때문에, 서버에서 강력한 보안 규칙을 적용하지 않으면 누구나 데이터를 변경 가능.
모바일 앱에서만 데이터를 수정할 수 있도록 해도, Firebase API를 직접 호출하면 Firestore의 데이터를 해킹할 수 있음)
2) 지금 중요한 데이터는, NextJS 의Backend API 통해서Server 에서 MongoDB 접근하기 때문에, 이러한 Rest API 통한 데이터 관리는 안전함. 
(즉, 현재는 중요한 데이터는 MongoDB 로 관리 (재고 관리, Authentication 등)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
3) 나중에 필요시, Firebase Authentication 과 현재 NextJS 통한 Authentication 로직 같이 결합해서 아래같은 방식으로, 외부에서 접근 불가하고 반드시 App의 로그인 통해서만 접근 가능하도록 할 수 있음 
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /instructions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
4) Firebasde 의 Storage(File System)도 아래처럼 모든 접근 가능하도록 하여 외부 수정에 위험할 수 있음(위 3과 마찬가지로, Auth 통해서 App 로그인 통해서만 접근 가능하도록 나중에 진행)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
5) android 및 ios 폴더 삭제하고, expo prebuild 하면 app.json 설정이 andorid 및 iso 폴더 설정에 반영됨. (폴더 직접 수정은 노노)
6) react-native-ble-manager
Generate Android code
in the example folder generate the android project from expo: npx expo prebuild --platform android
in the example/android folder run: ./gradlew generateCodegenArtifactsFromSchema (you can add --info to have debug messages)
if you have problems with the gradle cache cd android && ./gradlew --stop && rm -rf ~/.gradle/caches
Generate iOS code
in the example folder generate the ios project from expo: npx expo prebuild --platform ios
the codegen run during the first build, if you need to run it again use pod install in the ios folder
