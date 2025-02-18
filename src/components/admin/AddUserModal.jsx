  import { useState } from "react";
  import { HiOutlineX } from "react-icons/hi";
  import { Bars } from "react-loader-spinner";
  import "react-toastify/dist/ReactToastify.css";

  const AddUserModal = ({
    newUser,
    setNewUser,
    handleCreateUser,
    isLoading,
    onClose,
  }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      handleCreateUser();
    };

    return (
      <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
        <div className="relative bg-white p-4 m-4 rounded-lg shadow-lg w-full sm:w-[30rem] max-h-[90vh] overflow-x-auto space-y-6">
          {/* Overlay to block interactions when loading */}
          {isLoading && (
            <div className="absolute inset-0 flex justify-center h-full items-center bg-white/30 z-10">
              <Bars
                height="40"
                width="40"
                color="#B43F3F"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-slate-800">
              Add New User
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-600 cursor-pointer hover:text-red-800"
            >
              <HiOutlineX size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name <span className="text-lg text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                disabled={isLoading}
                className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B43F3F]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="w-full">
                <label
                  htmlFor="mobileNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile No <span className="text-lg text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobileNo"
                  value={newUser.mobileNo}
                  onChange={(e) =>
                    setNewUser({ ...newUser, mobileNo: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B43F3F]"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Id <span className="text-lg text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B43F3F]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role <span className="text-lg text-red-500">*</span>
              </label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                required
                disabled={isLoading}
                className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B43F3F]"
              >
                <option value="sales_executive">Sales Executive</option>
                <option value="growth_manager">Growth Manager</option>
                <option value="data_analyst">Data Analyst</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username <span className="text-lg text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
                disabled={isLoading}
                className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B43F3F]"
              />
            </div>
            <div>
              <label
                htmlFor="pswd"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-lg text-red-500">*</span>
              </label>
              <input
                type="password"
                id="pswd"
                value={newUser.pswd}
                onChange={(e) => setNewUser({ ...newUser, pswd: e.target.value })}
                required
                disabled={isLoading}
                className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B43F3F]"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700 focus:outline-none"
              >
                {isLoading ? (
                  <Bars
                    height="20"
                    width="20"
                    color="#ffffff"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : (
                  "Add User"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddUserModal;
