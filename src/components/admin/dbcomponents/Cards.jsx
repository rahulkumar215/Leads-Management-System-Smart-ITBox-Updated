import { useNavigate } from "react-router-dom";

// Reusable Card Components
export const Card = ({
  title,
  count,
  icon,
  color = "text-red-600",
  classes = "",
  route,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`grid grid-cols-[1fr_min-content] bg-white grid-rows-2 items-center border border-gray-100 p-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
      onClick={() => navigate(route)}
    >
      <h3 className="text-lg font-semibold col-start-1 col-span-2 text-gray-600">
        {title}
      </h3>
      <div className="text-gray-400 transition-colors duration-300">{icon}</div>
      <p className={`text-3xl font-bold ${color}`}>{count}</p>
    </div>
  );
};

export const Card2 = ({
  title,
  count,
  icon,
  color = "text-red-600",
  classes = "",
  route,
  textColor = "text-gray-600",
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`grid grid-cols-[3fr_1fr_1fr] bg-white items-center border border-gray-100 p-4 rounded-lg shadow-lg gap-x-4 transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
      onClick={() => navigate(route)}
    >
      <h3 className={`text-3xl font-bold col-start-1 col-span-1 ${textColor}`}>
        {title}
      </h3>
      <div className="text-gray-400 col-start-2 col-span-1 transition-colors duration-300">
        {icon}
      </div>
      <p
        className={`text-4xl font-bold col-start-3 col-span-1 justify-self-end ${color}`}
      >
        {count}
      </p>
    </div>
  );
};

export const Card3 = ({
  title,
  count,
  icon,
  color = "text-red-600",
  classes = "",
  route,
  textColor = "text-gray-600",
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`grid grid-cols-[min-content_1fr_min-content] bg-white items-center border border-gray-100 p-2 rounded-lg shadow-lg gap-x-4 transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
      onClick={() => navigate(route)}
    >
      <div className="text-gray-400 transition-colors duration-300">{icon}</div>
      <h3 className={`text-md font-bold ${textColor}`}>{title}</h3>
      <p className={`text-4xl font-bold justify-self-end ${color}`}>{count}</p>
    </div>
  );
};
