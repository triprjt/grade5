import { Loading, SubjectCard } from "@components";
import { Grid } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";

import { Sdk } from "@/services/sdk.service";

export default function Subjects() {
  const { data, isLoading } = useQuery(["/get-subjects"], () => Sdk.subject.getSubjects());
  if (isLoading) return <Loading />;
  return (
    <Grid
      container
      p={2}
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      justifyContent={"center"}
    >
      {data?.map((el) => {
        return (
          <Grid item key={el.id}>
            <SubjectCard {...el} />{" "}
          </Grid>
        );
      })}
    </Grid>
  );
}
