import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export default function Auth() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  const signIn = async () => {
    console.log("signIn");
    try {
      await GoogleSignin.hasPlayServices();
      console.log("signIn hasPlayServices");
      const response = await GoogleSignin.signIn();
      console.log("signIn response", JSON.stringify(response, null, 2));
      if (isSuccessResponse(response)) {
        console.log("signIn success", JSON.stringify(response.data, null, 2));
      } else {
        console.log("sign in was cancelled by user");
      }
      console.log("signIn end");
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        console.log("an error that's not related to google sign in occurred");
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={() => {
        signIn();
      }}
    />
  );
}
