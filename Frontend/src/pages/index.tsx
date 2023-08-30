import { PrimaryLayout } from "@components";
import appRoutes from "@constants/appRoutes";
import { Route, Routes } from "react-router-dom";

import { _LazyModuleDetails } from "./modules";
import { _laySubjects, _lazySubjectDetails } from "./subject";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<PrimaryLayout />}>
        <Route path={"/"} element={<_laySubjects />} />
        <Route path={appRoutes.subject_details_client} element={<_lazySubjectDetails />} />
        <Route path={appRoutes.module_details} element={<_LazyModuleDetails />} />
        <Route />
      </Route>
    </Routes>
  );
}
