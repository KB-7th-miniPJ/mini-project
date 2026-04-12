import axios from "axios";

export const getTravelList = () => axios.get("/api/travels");
export const getTravelDetail = (id) => axios.get(`/api/travels/${id}`);
export const createTravel = (travel) => axios.post("/api/travels", travel);
export const deleteTravel = (id) => axios.delete(`/api/travels/${id}`);
export const getTravelByInviteCode = (code) => axios.get(`/api/travels?inviteCode=${code}`);
export const updateTravelMembers = (id, membersCount) => axios.patch(`/api/travels/${id}`, { membersCount });
export const patchTravel = (id, payload) => axios.patch(`/api/travels/${id}`, payload);
