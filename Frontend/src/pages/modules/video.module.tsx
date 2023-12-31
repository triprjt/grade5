import { Box } from "@mui/material";
import { IContent } from "@MyTypes/content.type";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

import { Sdk } from "@/services/sdk.service";

export default function VIdeoModule(
  prop: Partial<IContent> & {
    refetch: () => void;
    setValue: React.Dispatch<React.SetStateAction<number>>;
  }
) {
  return (
    <Box
      pl={{ xs: 0.2, sm: 12 }}
      width={{ xs: "12rem", sm: "50rem" }}
      height={{ xs: "15rem", sm: "25rem" }}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <ReactPlayer
        height={"100%"}
        width={"100%"}
        loop={false}
        controls
        onEnded={() => {
          if (!prop?.body?.is_completed)
            Sdk.module.content.updateModuleContent(
              Number(prop?.body?.id),
              prop?.type || "video"
            );
          prop.refetch();
          toast("MCQ module unlocked", { type: "info" });
          return prop?.setValue(3);
        }}
        url={
          prop.body?.video ||
          "https://www.youtube.com/watch?v=nbNbfiJszHw&list=RDCLAK5uy_ksEjgm3H_7zOJ_RHzRjN1wY-_FFcs7aAU"
        }
      />
    </Box>
  );
}
