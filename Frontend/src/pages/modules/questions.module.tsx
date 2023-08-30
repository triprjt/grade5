import { IContent, IQuestion } from "@MyTypes/content.type";
import { useMemo } from "react";

function QuestionCard(question: IQuestion) {
  const choices = useMemo(() => {
    const keys = Object.keys(question);
    const choices = keys.find((el) => el.startsWith("choice"));
    // console.log(choices);
  }, []);

  return <>dfadas</>;
}

export default function QuestionModule(prop: Partial<IContent>) {
  // console.log(prop, "prop");
  return <p>ahudfhuahgda</p>;
}
