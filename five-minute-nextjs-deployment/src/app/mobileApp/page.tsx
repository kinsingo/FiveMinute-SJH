"use client";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";

//100MB 미만일 경우, Github에 업로드하여 다운로드 가능
//나중에 100MB 넘어가게 되면 AWS S3에 업로드하여 다운로드 가능 (Presigned URL 사용)
const ANDROID_APP_URL = "https://firebasestorage.googleapis.com/v0/b/fiveminutedonburi.firebasestorage.app/o/_5min.apk?alt=media&token=9f27395a-558e-4c7f-b384-60930a1e7c34";
const IOS_APP_URL = "https://apps.apple.com/us/app/fiveminutericebowl/id6742189608";
import MKButton from "@/MKcomponents/MKButton";

export default function MobileDownloadPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card
        sx={{ maxWidth: 400, padding: 3, textAlign: "center", boxShadow: 5 }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            모바일 앱 다운로드
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Android 및 iOS에서 앱을 다운로드하세요.
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {/* Android 다운로드 버튼 */}
            <Grid item xs={12}>
              <MKButton
                variant="contained"
                color="success"
                startIcon={<AndroidIcon />}
                fullWidth
                href={ANDROID_APP_URL}
                rel="noopener noreferrer"
              >
                Android 앱 다운로드
              </MKButton>
            </Grid>

            {/* iOS 다운로드 버튼 */}
            <Grid item xs={12}>
              <MKButton
                variant="contained"
                color="primary"
                startIcon={<AppleIcon />}
                fullWidth
                href={IOS_APP_URL}
                rel="noopener noreferrer"
              >
                App Store에서 다운로드 가능
              </MKButton>
            </Grid>
          </Grid>
        </CardContent>
       <Typography variant="h6" fontWeight="bold" gutterBottom>
          ✅ Android 보안 설정 변경
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={1}>
          APK 설치 시 <strong>출처를 알 수 없는 앱 설치 허용</strong> 설정이
          필요할 수 있습니다.
        </Typography>
      </Card>
    </Box>
  );
}
