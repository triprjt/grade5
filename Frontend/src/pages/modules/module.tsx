/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { Loading } from "@components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookIcon from "@mui/icons-material/Book";
import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { IContentType } from "@MyTypes/content.type";
import * as React from "react";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { Sdk } from "@/services/sdk.service";

import ImageModule from "./image.module";
import McqModule from "./mcq.module";
import TextModule from "./text.module";
import VIdeoModule from "./video.module";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
import appRoutes from "@constants/appRoutes";
import BungalowIcon from "@mui/icons-material/Bungalow";
import { Padding } from "@mui/icons-material";
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ModuleDetails() {
  const id = useParams();
  const [value, setValue] = React.useState(0);
  const subjectId = JSON.parse(localStorage.getItem("_subject_id") || "");
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery(
    ["get-module-details", id.id],
    () => Sdk.module.content.getContents(Number(id.id ?? 0)),
    {
      enabled: !!id.id,
    }
  );
  const textModule = data?.find((el) => el.type === "text");
  const imageModule = data?.find((el) => el.type === "image");
  const mcqModule = data?.find((el) => el.type === "mcq");
  const videoModule = data?.find((el) => el.type === "video");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getColor = useCallback(
    (type: IContentType, _currentValue: number) => {
      const target = data?.find((el) => el.type == type);
      if (target?.body.is_completed) return "#62e6b1";
      else if (value == _currentValue && !target?.body.is_completed)
        return "#f27629";
      else return "#5640e8";
    },
    [data]
  );

  if (isLoading) return <Loading />;

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Stack direction={"row"} p={3} justifyContent={"space-between"}>
        <Stack direction={"row"}>
          <Button onClick={() => navigate("/")} startIcon={<BungalowIcon />}>
            Home
          </Button>

          <Button
            variant="text"
            onClick={() => navigate(appRoutes._subject_details(+subjectId))}
            startIcon={<BookIcon />}
          >
            chapter list
          </Button>
        </Stack>

        <Button variant="text" onClick={() => navigate(-1)}>
          back
        </Button>
      </Stack>

      <Box sx={{ width: "90%", margin: "auto", p: 6 }}>
        <Stack direction={"row"}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              orientation="vertical"
              textColor="inherit"
            >
              <Tab
                label="Text"
                {...a11yProps(0)}
                sx={{
                  bgcolor: getColor("text", 0),
                }}
              />
              <Tab
                sx={{
                  bgcolor: getColor("image", 1),
                  mt: 1,
                }}
                disabled={!textModule?.body.is_completed}
                label="Images"
                {...a11yProps(1)}
              />
              <Tab
                sx={{
                  bgcolor: getColor("video", 2),
                  mt: 1,
                }}
                disabled={
                  !textModule?.body.is_completed ||
                  !imageModule?.body.is_completed
                }
                label="Videos"
                {...a11yProps(2)}
              />
              <Tab
                sx={{
                  bgcolor: getColor("mcq", 3),
                  mt: 1,
                }}
                disabled={
                  !textModule?.body.is_completed ||
                  !imageModule?.body.is_completed ||
                  !videoModule?.body.is_completed
                }
                label="Mcq"
                {...a11yProps(3)}
              />
            </Tabs>
          </Box>
          <Box>
            <CustomTabPanel value={value} index={0}>
              <TextModule
                {...textModule}
                refetch={refetch}
                setValue={setValue}
              />
            </CustomTabPanel>
            <div>
              <CustomTabPanel value={value} index={1}>
                <ImageModule
                  {...imageModule}
                  refetch={refetch}
                  setValue={setValue}
                />
              </CustomTabPanel>

              <CustomTabPanel value={value} index={2}>
                <VIdeoModule
                  {...videoModule}
                  refetch={refetch}
                  setValue={setValue}
                />
              </CustomTabPanel>
            </div>
            <CustomTabPanel value={value} index={3}>
              <McqModule {...mcqModule} refetch={refetch} setValue={setValue} />
            </CustomTabPanel>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
