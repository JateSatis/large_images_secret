// import { classNames } from "shared/lib/classNames/classNames";
import cls from "./Sidebar.module.scss";
interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={cls.sidebar}>
      <div className="main-buttons"></div>
      <div className="comments"></div>
      <div className="screenshots"></div>
      <div className="ai"></div>
      <div className="curves"></div>
    </div>
  );
};
