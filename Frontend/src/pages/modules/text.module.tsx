import { LinearProgress, Stack, Typography } from "@mui/material";
import { IContent } from "@MyTypes/content.type";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ProgressBar } from "react-toastify/dist/components";

import { Sdk } from "@/services/sdk.service";

export default function TextModule({
  body,
  refetch,
  setValue,
}: Partial<IContent> & {
  refetch: () => void;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const [isBottom, setIsBottom] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  function calculateScrollPercentage(): number {
    const container = containerRef.current;
    if (!container) return 0;
    const scrollTop = window.pageYOffset || container.scrollTop;
    const totalHeight = container.scrollHeight - container.clientHeight;

    if (totalHeight <= 0) {
      return 0; // Prevent division by zero
    }

    const scrollPercentage = (scrollTop / totalHeight) * 100;
    return Math.min(100, scrollPercentage); // Ensure the result is capped at 100%
  }
  const handleScroll = () => {
    const container = containerRef.current;

    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      setScrollPercentage(calculateScrollPercentage());
      if (Math.floor(scrollHeight - scrollTop) === clientHeight) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      container.addEventListener("load", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const markAsCompleted = async () => {
    if (!body?.is_completed) {
      Sdk.module.content.updateModuleContent(Number(id), "text");
      refetch();
      toast("image module unlocked", { type: "info" });
      return setValue(1);
    }
    return;
  };

  useEffect(() => {
    if (isBottom) {
      markAsCompleted();
    } else handleScroll();
  }, [isBottom]);

  return (
    <>
      <LinearProgress variant="determinate" value={scrollPercentage} />
      <Stack ref={containerRef} p={2} height={"50vh"} sx={{ overflowY: "auto" }}>
        <Typography>{body?.text}</Typography>
      </Stack>
    </>
  );
}
