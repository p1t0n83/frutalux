import React from "react";
import { Outlet } from "react-router-dom";
import AppMenu from "./AppMenu";
import AppFooter from "./AppFooter";

export default function AppLayout() {
  return (
    <div className="layout-container">
      <AppMenu />
      <main className="main-content">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
