import Sidebar from "./sidebar";
import styles from './page.module.css';
import React from "react";

export default function Layout({children}: {children: React.ReactNode}) {
    return(
        <div className={styles.dashboardLayout}>
            <Sidebar />
            {children}
        </div>
    )
}
