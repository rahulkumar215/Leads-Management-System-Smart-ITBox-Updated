import { Card3 } from "./Cards";
import { FiUserPlus } from "react-icons/fi";

function UserSection({ userCounts }) {
  return (
    <div className=" col-start-2 col-span-1 row-start-1 row-span-1">
      <h2 className="text-xl tracking-wide font-semibold mb-4">User Counts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {userCounts ? (
          Object.entries(userCounts).map(([role, count]) => (
            <Card3
              key={role}
              title={role}
              count={count}
              icon={<FiUserPlus size={20} />}
              color="text-gray-500 text-2xl sm:text-4xl"
            />
          ))
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
}

export default UserSection;
