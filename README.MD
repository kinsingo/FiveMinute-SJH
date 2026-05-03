
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
