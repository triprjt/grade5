/* eslint-disable @typescript-eslint/no-explicit-any */
import "swiper/css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Box } from "@mui/material";
import { IContent } from "@MyTypes/content.type";
import { toast } from "react-toastify";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Sdk } from "@/services/sdk.service";

export default function ImageModule(
  prop?: Partial<IContent> & {
    refetch: () => void;
    setValue: React.Dispatch<React.SetStateAction<number>>;
  }
) {
  const updateImage = async (swiper: any) => {
    /* The code block is checking if the active index of the Swiper component is equal to the length of
  the `prop?.body.image` array minus 1. If it is not equal, the function returns and does nothing.
  If it is equal, it calls the `Sdk.module.content.updateModule` function with the `prop?.body.id`
  and `prop?.type` values as arguments. */
    const flag = swiper.activeIndex === (prop?.body?.image || []).length - 1;
    if (!flag) return;
    if (!prop?.body?.is_completed) {
      Sdk.module.content.updateModuleContent(
        Number(prop?.body?.id),
        prop?.type || "image"
      );
      prop?.refetch();
      toast("video module unlocked", { type: "info" });
      return prop?.setValue(2);
    }
  };

  return (
    <Box pl={12} width={"70rem"} margin={"auto"}>
      <Swiper
        {...({
          modules: [Navigation, Pagination, Scrollbar, A11y],
          spaceBetween: 50,
          slidesPerView: 1,
          onSlideChange: updateImage,
          // onSwiper: (swiper) => console.log(swiper, "swiper"),
          navigation: true,
          allowSlideNext: true,
        } as any)}
      >
        {prop?.body?.image?.map((el) => {
          return (
            <SwiperSlide key={el}>
              <Box
                height={"20rem"}
                width={"100%"}
                sx={{
                  backgroundImage: `url(${el})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                bgcolor={"Background"}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}
