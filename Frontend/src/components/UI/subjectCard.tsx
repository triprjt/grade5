import apitRoutes from "@constants/appRoutes";
import { CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { ISubject } from "@MyTypes/subject.type";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function SubjectCard(prop: ISubject) {
  const navigate: NavigateFunction = useNavigate();

  const handleCardClick = () => {
    if (prop.id === 1) {
      navigate(apitRoutes._subject_details(prop.id));
    } else {
      navigate("/");
    }
  };

  const urlMap = {
    1: "https://firebasestorage.googleapis.com/v0/b/grade5-2448a.appspot.com/o/3D_Animation_Style_A_vibrant_detailed_illustration_of_Isaac_Ne_0.jpeg?alt=media&token=6896786c-fe1c-43d7-960a-2f60f073c518",
    2: "https://firebasestorage.googleapis.com/v0/b/grade5-2448a.appspot.com/o/3D_Animation_Style_A_minimalist_math_textbook_cover_with_a_sin_0.jpeg?alt=media&token=f25ac4c1-94ed-499a-a6c6-0c7294d22f3e",
    3: "https://firebasestorage.googleapis.com/v0/b/grade5-2448a.appspot.com/o/3D_Animation_Style_A_minimalist_chemistry_textbook_cover_featu_0.jpeg?alt=media&token=e4e1d26c-32ce-4e98-90d4-62b5bb8fdaec",
    4: "https://firebasestorage.googleapis.com/v0/b/grade5-2448a.appspot.com/o/3D_Animation_Style_A_minimalist_biology_cover_featuring_a_sing_0.jpeg?alt=media&token=788fc404-421c-4cbf-a4e5-730cbef5d39f",
  };

  const paraMap = {
    1: "A textbook of Physics for class 5",
    2: "A textbook of Mathematics for class 5",
    3: "A textbook of Chemistry for class 5",
    4: "A textbook of Biology for class 5",
  };
  const paragraphText = paraMap.hasOwnProperty(prop.id)
    ? paraMap[prop.id as keyof typeof paraMap]
    : "Default description text"; // Replace this with your default text

  // Use prop.id instead of prop.name
  const imageUrl = urlMap.hasOwnProperty(prop.id)
    ? urlMap[prop.id as keyof typeof urlMap]
    : "https://picsum.photos/200/300";

  return (
    <Card sx={{ maxWidth: 345 }} onClick={handleCardClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={prop.name}
        />
        <CardContent>
          <Typography
            sx={{ textTransform: "capitalize" }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {prop.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {paragraphText}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
