/* eslint-disable @typescript-eslint/naming-convention */
import { Loading } from "@components";
import appRoutes from "@constants/appRoutes";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { IModule } from "@MyTypes/module.type";

import { Sdk } from "@/services/sdk.service";

export default function SubjectDetails() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const [chapterId, setChapterId] = useState<number | null>();
  const id = useParams();
  const { data, isLoading } = useQuery(
    ["get-chapter-details", id.id],
    () => Sdk.subject.getChaptersForSubject(Number(id?.id || 0)),
    { enabled: !!id.id }
  );

  /* The code snippet is using the `useQuery` hook from the `react-query` library to fetch module data
 based on the `chapterId` state variable. */
  const { data: moduleData, isLoading: isModuleLoading } = useQuery(
    ["get-module-data", chapterId],
    () => Sdk.module.getModuleContent(chapterId ?? 0),
    {
      enabled: !!chapterId,
    }
  );

  const navigate = useNavigate();
  /**
   * The function `isLocked` checks if all elements before a given index in an array have a property
   * `is_completed` set to `true`.
   * @param {number} idx - The `idx` parameter is a number that represents the index of an element in an
   * array.
   * @returns The function `isLocked` returns a boolean value.
   */
  const isLocked = (idx: number) => {
    if (idx === 0) return false;
    const rest = data?.slice(0, idx);
    const isAllCompleted = rest?.find(
      (chapter) => chapter.is_completed == false
    );
    return !!isAllCompleted;
  };

  const isModuleLocker = (idx: number) => {
    if (idx === 0) return false;
    const rest = moduleData?.slice(0, idx);
    const isAllCompleted = rest
      ?.sort((a, b) => a.id - b.id)
      .find((chapter) => chapter.is_completed == false);

    return !!isAllCompleted;
  };

  const getModuleColor = useCallback(
    (id: number) => {
      if (!moduleData) return;
      const sortedModules = moduleData.sort((a, b) => a.id - b.id);
      const latCompleted = sortedModules.findIndex(
        (el, idx, arr) =>
          el.is_completed == true &&
          (idx === arr.length - 1 || arr[idx + 1].is_completed == false)
      );
      const tIndex = latCompleted + 1;
      const targetIndex = sortedModules.findIndex((el: IModule) => el.id == id); // specify the type here
      if (tIndex == targetIndex) return "orange";
      const target = moduleData.find((el: IModule) => el.id == id); // specify the type here
      if (target?.is_completed) return "green";
      else return "ghostwhite";
    },
    [moduleData]
  );

  const _handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  if (isLoading) return <Loading />;

  return (
    <Box p={6} pt={2} sx={{ alignItems: "start" }}>
      <Button
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
      >
        back
      </Button>
      {data
        ?.sort((a, b) => a.id - b.id)
        ?.map((chapter, idx) => {
          return (
            <Accordion
              expanded={expanded === chapter.id?.toString()}
              onChange={(v) => setExpanded(chapter.id?.toString())}
              key={chapter.id}
              disabled={isLocked(idx)}
              onClick={() => setChapterId(chapter.id)}
            >
              <AccordionSummary
                sx={{
                  ":hover": {
                    bgcolor: "ghostwhite",
                  },
                }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  {chapter.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {isModuleLoading ? (
                  <Loading />
                ) : (
                  <Box p={2}>
                    <Stepper orientation="vertical">
                      {moduleData
                        ?.sort((a, b) => a.id - b.id)
                        ?.map((_modules, idx) => {
                          return (
                            <Step
                              active={!isModuleLocker(idx)}
                              disabled={isModuleLocker(idx)}
                              key={_modules.id}
                              onClick={() => {
                                // console.log(isModuleLocker(idx), idx);
                                !isModuleLocker(idx) &&
                                  navigate(
                                    appRoutes._module_details(_modules.id)
                                  );
                                localStorage.setItem(
                                  "chapter_id",
                                  JSON.stringify(chapter.id)
                                );
                                localStorage.setItem(
                                  "subject_id",
                                  JSON.stringify(id.id)
                                );
                              }}
                              sx={{
                                p: 1,
                                ":hover": {
                                  bgcolor: getModuleColor(_modules.id),
                                },
                              }}
                            >
                              <StepLabel
                                StepIconProps={{
                                  color: getModuleColor(_modules.id),
                                }}
                                StepIconComponent={
                                  isModuleLocker(idx) ? LockIcon : undefined
                                }
                                sx={{
                                  cursor: "pointer",
                                  ":hover": {
                                    color: getModuleColor(_modules.id),
                                  },
                                }}
                              >
                                {_modules.name}
                              </StepLabel>
                            </Step>
                          );
                        })}
                    </Stepper>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Box>
  );
}
