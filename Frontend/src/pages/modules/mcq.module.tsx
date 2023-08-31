/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Loading } from "@components";
import appRoutes from "@constants/appRoutes";
import { Button, Checkbox, Stack, Typography } from "@mui/material";
import { IContent, IQuestion } from "@MyTypes/content.type";
import { IModule } from "@MyTypes/module.type";
import { IChapter } from "@MyTypes/subject.type";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Sdk } from "@/services/sdk.service";
import { IDispatch, IRootState } from "@/store/store";

function QuestionCard(prop: {
  choices: {
    q: string;
    qId: string;
  }[];
}) {
  const [answers, setAnswers] = useState<{ q: string; qId: string }[]>([]);

  const updateAnswerState = (prop: { q: string; qId: string }) => {
    setAnswers([...answers, prop]);
  };

  return (
    <Stack>
      {prop.choices.map((el) => {
        return (
          <Stack key={el.q}>
            <Checkbox onChange={() => updateAnswerState(el)} />
            <Typography>{el.q}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default function McqModule({
  body,
  setValue,
}: Partial<IContent> & {
  refetch: () => void;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}) {
  const root = useSelector((state: IRootState) => state.mcqModel);
  const index = root.index;
  const answeredArray = root.answeredValues;
  const dispatch: IDispatch = useDispatch();
  const { id } = useParams();
  const qClient = useQueryClient();
  const [moduleReady, setModuleReady] = useState(false);
  const navigate = useNavigate();
  const [choiceIndex, setChoiceIndex] = useState(0);
  const chapter_id = localStorage.getItem("chapter_id") || "";
  const subjectId = localStorage.getItem("subject_id");
  // const moduleData: IModule[] | undefined = qClient.getQueryData(["get-module-data", +chapter_id]);

  const { data: chaptersData, isLoading } = useQuery(
    ["get-chapter-details", chapter_id],
    () => Sdk.subject.getChaptersForSubject(Number(chapter_id || 0)),
    { enabled: !!chapter_id }
  );

  /* The code snippet is using the `useQuery` hook from the `react-query` library to fetch module data
 based on the `chapterId` state variable. */
  const { data: moduleData, isLoading: isModuleLoading } = useQuery(
    ["get-module-data", chapter_id],
    () => Sdk.module.getModuleContent(Number(chapter_id) ?? 0),
    {
      enabled: !!chapter_id,
    }
  );
  const currentModule = moduleData?.find((el) => el.id == +(id || ""));

  const notify = (flag: boolean) =>
    toast(flag ? "correct answer" : "wrong answer", {
      type: flag ? "success" : "error",
    });

  const choices = useMemo(() => {
    const question: IQuestion[] | undefined = body?.questions;
    if (question === undefined) return [];
    const target = question[index];
    const response: { q: string; qId: string }[] = [];
    const keys = Object.keys(target);
    const choices = keys.filter((el) => el.startsWith("choice"));
    choices.forEach((el: string) => {
      response.push({
        q: target[`${el as keyof IQuestion}`] as string,
        qId: el,
      });
    });

    return response;
  }, [index]);

  const handleBack = () => {
    if (index - 1 < 0) return;
    dispatch.mcqModel.handleIndex(index - 1);
  };
  const handleNext = () => {
    if (index + 1 > choices.length - 1) return;
    dispatch.mcqModel.handleIndex(index + 1);
  };

  async function handleSubmitAnswer(idx: number) {
    if (!body?.questions) return;
    const target = body?.questions[index];
    const correctAnswer = target.correct_choice;
    const flag = correctAnswer == idx;
    setChoiceIndex(0);
    if (flag && body.questions.length > index + 1) {
      dispatch.mcqModel.handleIndex(index + 1);
      dispatch.mcqModel.handleAnsweredValues(index);
    }
    notify(flag);
    if (flag && body.questions.length <= index + 1) {
      await Sdk.module.content.updateModuleContent(Number(body?.id), "mcq");
      setModuleReady(true);
    }
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateModule = async () => {
    await Sdk.module.content.updateModule(Number(body?.id));
    toast("Module Completed !!", { type: "success" });
    completeFlow();
    setModuleReady(false);
  };

  /**
   * The `completeFlow` function checks if all modules in `moduleData` are completed, updates chapter
   * progress and navigates to the subjects page if they are, otherwise it navigates to the next module
   * in `moduleData`.
   * @returns The function `completeFlow` returns either `undefined` or the result of the `navigate`
   * function.
   */

  const completeFlow = () => {
    const sortedModule = moduleData?.sort((a, b) => a.id - b.id);
    const isAllCompleted = sortedModule?.find((el) => el.is_completed == false);

    if (!sortedModule) return;
    if (!isAllCompleted?.id || isAllCompleted.id !== +(id || 0)) {
      Sdk.subject.updateChapterProgress(+chapter_id);
      return navigate(appRoutes._subject_details(JSON.parse(subjectId || "")));
    }
    const currentModuleIndex =
      sortedModule?.findIndex((el) => el.id == +(id || "")) || 0;

    if (currentModuleIndex >= 0) {
      const targetIndex = currentModuleIndex + 1;
      if (targetIndex > sortedModule?.length || 0) return;
      setValue(0);
      return navigate(appRoutes._module_details(sortedModule[targetIndex].id));
    }
  };
  if (isLoading || isModuleLoading) return <Loading />;
  // console.log(answeredArray, "answeredArray");
  return (
    <Stack gap={2} p={2} alignItems={"start"}>
      {index + 1 - 1 > 0 && (
        <Button onClick={handleBack}>previous question</Button>
      )}
      {answeredArray?.includes(index) ? (
        <Button onClick={handleNext}>next question</Button>
      ) : (
        ""
      )}
      <Stack>
        <Typography fontWeight={"600"}>
          {index + 1}: {(body?.questions || [])[index]?.question_title}
        </Typography>
        <Stack>
          {choices.map((el, idx) => {
            return (
              <Stack key={el.q} direction={"row"} alignItems={"center"}>
                <Checkbox
                  checked={choiceIndex == idx + 1}
                  value={{ ...el, idx: idx + 1 }}
                  onChange={() => setChoiceIndex(idx + 1)}
                />
                <Typography>{el.q}</Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <Stack sx={{ alignItems: "start", pt: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            handleSubmitAnswer(choiceIndex);
          }}
        >
          {"submit"}
        </Button>

        {moduleReady || body?.is_completed ? (
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="primary"
            onClick={async () => {
              if (currentModule?.is_completed && chaptersData) {
                const sortedChapters = chaptersData.sort((a, b) => a.id - b.id);
                const chapterId = currentModule.chapter;
                const currentChapter = sortedChapters.findIndex((el) =>
                  el.name.includes(chapterId?.toString())
                );
                const next = sortedChapters[currentChapter + 1].id;
                const nextModule = (
                  await Sdk.module.getModuleContent(Number(chapterId + 1) ?? 0)
                ).sort((a, b) => a.id - b.id);
                setValue(0);
                navigate(appRoutes._module_details(nextModule[0].id));
              } else updateModule();
            }}
          >
            {currentModule?.is_completed ? "next Module" : "complete module"}
          </Button>
        ) : (
          ""
        )}
      </Stack>
    </Stack>
  );
}
