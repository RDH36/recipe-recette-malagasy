import { supabase } from "@/lib/supabase";

export interface PushTokenProps {
  deviceName: string | null;
  expoPushToken: string;
}

export async function saveExpoPushToken({
  expoPushToken,
  deviceName,
}: PushTokenProps) {
  const { data: existingToken, error: selectError } = await supabase
    .from("expo_push_tokens")
    .select("id")
    .eq("expoPushToken", expoPushToken)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    console.error(
      "Erreur pendant la vérification du token :",
      selectError.message
    );
    return;
  }

  if (existingToken) {
    console.log("Token déjà enregistré 🛡️");
    return;
  }

  const { error: insertError } = await supabase
    .from("expo_push_tokens")
    .insert([
      {
        expoPushToken,
        device_name: deviceName || null,
      },
    ]);

  if (insertError) {
    console.error("Erreur pendant l’insertion du token :", insertError.message);
  } else {
    console.log("Token enregistré avec succès ✅");
  }
}
