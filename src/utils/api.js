import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
// const token = localStorage.getItem("user_token");

export const getToken = () =>
  localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null;

// Functions Start //
export async function postMethodNormalAPI(url, body) {
  const apiData = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      "Content-Type": "application/json",
    },
  });
  return apiData;
}
export async function postMethodNormalAPIPUT(url, body) {
  const apiData = await axios.put(url, body, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      "Content-Type": "application/json",
    },
  });
  return apiData;
}
export async function postMethodMultiPartAPI(url, body) {
  const apiData = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return apiData;
}
export async function getMethodNormal(
  url,
  token = localStorage.getItem("user_token")
) {
  console.log("url", url);
  const apiData = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      "Content-Type": "application/json",
    },
  });
  return apiData;
}

// Functions end //
// API URLS Start
const getProjectsURL = `${API_URL}/projects`;
const getProjectsDataURL = `${API_URL}/getProjectsData`;
const generateMultiProjectWeeklyReportURL = `${API_URL}/generateMultiProjectWeeklyReport`;
const generateReportByDateRangeURL = `${API_URL}/generateReportByDateRange`;
const updateProjectURL = `${API_URL}/updateProject`;

const getTemplatesURL = `${API_URL}/getTemplates`;
const createTemplateURL = `${API_URL}/createTemplate`;
const updateTemplateURL = `${API_URL}/updateTemplate`;
const updateTemplateDetailsURL = `${API_URL}/updateTemplateDetails`;
const deleteTemplateDetailsURL = `${API_URL}/deleteTemplateDetails`;
const deleteTodoFromTemplateURL = `${API_URL}/deleteTodoFromTemplate`;
const addTemplatesURL = `${API_URL}/addTemplates`;

//login URL
const loginURL = `${API_URL}/admin/login`;
const citiesURL = `${API_URL}/cities`;
const createTaskURL = `${API_URL}/createTask`;
const addFilesInTaskURL = `${API_URL}/addFilesInTask`;
const addFilesInSubTaskURL = `${API_URL}/addFilesInSubTask`;
const deleteFileFromTodoURL = `${API_URL}/deleteFileFromTodo`;
const addFilesToTemplateURL = `${API_URL}/addFilesToTemplate`;
const addTodoInTaskURL = `${API_URL}/addTodoInTask`;
const addTodoInTemplateURL = `${API_URL}/addTodoInTemplate`;
const deleteFileFromTaskTodoURL = `${API_URL}/deleteFileFromTaskTodo`;
const updateTodoByIdURL = `${API_URL}/updateTodoById`;
const updateTodoInTemplateURL = `${API_URL}/updateTodoInTemplate`;
const getTaskByIdURL = `${API_URL}/getTaskById`;
const updateTaskURL = `${API_URL}/updateTask`;
const createBlogURL = `${API_URL}/createBlog`;
const createJobsURL = `${API_URL}/createJobs`;
const getJobsURL = `${API_URL}/getJobs`;
const getBlogsURL = `${API_URL}/getBlogs`;
const updateCityURL = `${API_URL}/updateCity`;
const categoriesURL = `${API_URL}/categories`;
const updateCategoryURL = `${API_URL}/updateCategory`;
const createBookingURL = `${API_URL}/createBooking`;

//Leaves Url////////////////////////////////////////////////////////////
const createLeaveURL = `${API_URL}/createLeave`;
const updateLeaveURL = `${API_URL}/updateLeave`;
const getAllLeavesURL = `${API_URL}/getAllLeaves`;
const getLeaveByIdURL = `${API_URL}/getLeaveById/:id`;
const getLeavesByStatusURL = `${API_URL}/getLeavesByStatus`;
////////////////////////////////////////////////////////////////////////
//trips url
const getTripsWithTitleURL = `${API_URL}/getTripsWithTitle`;
const tripsURL = `${API_URL}/trips`;
const createTimeSheetURL = `${API_URL}/createTimeSheet`;
const getTimeSheetByUserIdURL = `${API_URL}/getTimeSheetByUserId/`;
const getTimeSheetByUserIdCurrentMonthURL = `${API_URL}/getTimeSheetByUserIdCurrentMonth/`;
const getUserTimesheetDetailsURL = `${API_URL}/getUserTimesheetDetails`;
const tripByIDURL = `${API_URL}/trip/`;
const addCityToTripURL = `${API_URL}/trips/addCityToTrip`;
const addCategoryInTripURL = `${API_URL}/trips/addCategoryInTrip`;
const addDatesToTripsNewURL = `${API_URL}/trips/addDatesToTripsNew`;
const deleteDatesToTripsNewURL = `${API_URL}/trips/deleteDatesToTripsNew`;
const updateDatesToNewURL = `${API_URL}/trips/updateDatesToNew`;
const updateDatesToNewSingleEntryURL = `${API_URL}/trips/updateDatesToNewSingleEntry`;
const addImageToTripURL = `${API_URL}/trips/addImageToTrip`;
const removeTripImageURL = `${API_URL}/trips/removeTripImage`;
const deleteCityFromTripURL = `${API_URL}/trips/deleteCityFromTrip`;
const updateTripDataURL = `${API_URL}/trips/updateTripData`;
const updatePriceInTripsURL = `${API_URL}/trips/updatePriceInTrips`;
const addDatesToTripsURL = `${API_URL}/trips/addDatesToTrips`;
const addPriceToTripsURL = `${API_URL}/trips/addPriceToTrips`;
const addScheduleToTripURL = `${API_URL}/trips/addScheduleToTrip`;
const sliderImagesURL = `${API_URL}/slider_images`;
const deleteSliderImageURL = `${API_URL}/deleteSliderImage/`;
const deleteVideoURL = `${API_URL}/deleteVideo/`;
const sectionsURL = `${API_URL}/sections`;
const addUserURL = `${API_URL}/admin/user`;
const generateTimeSheetReportURL = `${API_URL}/generateTimeSheetReport`;
const generateProjectWeeklyReportURL = `${API_URL}/generateProjectWeeklyReport`;
const addCustomerURL = `${API_URL}/createNewCustomer`;
const updateCustomerURL = `${API_URL}/updateCustomer`;
const getProjectByIdURL = `${API_URL}/getProjectById`;
const createProjectURL = `${API_URL}/createProject`;
const addProjectsURL = `${API_URL}/addProjects`;
const getUsersURL = `${API_URL}/admin/getUsers`;
const getTaskMasterURL = `${API_URL}/admin/tasksMaster`;
const updateUserURL = `${API_URL}/admin/updateUser`;
const getSectionByIdURL = `${API_URL}/sections/`;
const getEnquiryByIdURL = `${API_URL}/getEnquiryById`;
const updateSectionURL = `${API_URL}/updateSection`;
const addTripInSectionsURL = `${API_URL}/addTripInSections`;
const addDetailsToEnquiryURL = `${API_URL}/addDetailsToEnquiry`;
const deleteTripFromSectionURL = `${API_URL}/deleteTripFromSection`;
const addFaqToTripURL = `${API_URL}/trips/addFaqToTrip`;
const addOnToTripURL = `${API_URL}/trips/addOnToTrip`;
const removeTripFaqURL = `${API_URL}/trips/removeTripFaq`;

const getTestimonialsURL = `${API_URL}/getTestimonials`;
const addTestimonialsURL = `${API_URL}/addTestimonials`;
const updateTestimonialsURL = `${API_URL}/updateTestimonials`;
const getVideosURL = `${API_URL}/getVideos`;
const addVideoURL = `${API_URL}/addVideo`;

const getCouponsURL = `${API_URL}/getCoupons`;
const createCouponsURL = `${API_URL}/createCoupons`;
const updateCouponsURL = `${API_URL}/updateCoupons`;

// Leaves//////////////////////////////////////////////
export async function getAllLeaves() {
  return getMethodNormal(getAllLeavesURL);
}
export async function getLeaveById() {
  return getMethodNormal(getLeaveByIdURL);
}
export async function getLeavesByStatus(stats) {
  console.log(stats);
  var s = getLeavesByStatusURL + "/" + stats;
  return getMethodNormal(s);
}

export async function createLeave(body) {
  return postMethodMultiPartAPI(createLeaveURL, body);
}
export async function updateLeave(body) {
  return postMethodMultiPartAPI(`${updateLeaveURL}/${body.id}`, body);
}

//////////////////////////////////////////////////////////
// updateCustomerURL;
export async function updateCustomer(body) {
  return postMethodNormalAPI(updateCustomerURL, body);
}
export async function getAllCities(token) {
  return getMethodNormal(citiesURL);
}
export async function getBlogs(token) {
  return getMethodNormal(getBlogsURL);
}
export async function getJobs(token) {
  return getMethodNormal(getJobsURL);
}
export async function getVideos(token) {
  return getMethodNormal(getVideosURL);
}
export async function getCoupons() {
  return getMethodNormal(getCouponsURL);
}
export async function addCity(body) {
  return postMethodMultiPartAPI(citiesURL, body);
}
export async function createTask(body) {
  return postMethodMultiPartAPI(createTaskURL, body);
}
export async function addFilesInTask(body) {
  return postMethodMultiPartAPI(addFilesInTaskURL, body);
}
export async function addFilesInSubTask(body) {
  return postMethodMultiPartAPI(addFilesInSubTaskURL, body);
}
export async function deleteFileFromTodo(body) {
  return postMethodMultiPartAPI(deleteFileFromTodoURL, body);
}
export async function addFilesToTemplate(body) {
  return postMethodMultiPartAPI(addFilesToTemplateURL, body);
}
export async function addTodoInTask(body) {
  return postMethodNormalAPI(addTodoInTaskURL, body);
}
export async function addTodoInTemplate(body) {
  return postMethodMultiPartAPI(addTodoInTemplateURL, body);
}
export async function deleteFileFromTaskTodo(body) {
  return postMethodNormalAPI(deleteFileFromTaskTodoURL, body);
}

export async function updateTodoById(body) {
  return postMethodNormalAPI(updateTodoByIdURL, body);
}
export async function updateTodoInTemplate(body) {
  return postMethodNormalAPI(updateTodoInTemplateURL, body);
}
export async function getTaskById(body) {
  return postMethodNormalAPI(getTaskByIdURL, body);
}
export async function updateTask(body) {
  return postMethodMultiPartAPI(updateTaskURL, body);
}
export async function createBlog(body) {
  return postMethodMultiPartAPI(createBlogURL, body);
}
export async function createJobs(body) {
  return postMethodNormalAPI(createJobsURL, body);
}
export async function addProjects(body) {
  return postMethodNormalAPI(addProjectsURL, body);
}
export async function getEnquiryById(body) {
  return postMethodNormalAPI(getEnquiryByIdURL, body);
}
export async function getProjects(body) {
  return getMethodNormal(getProjectsURL, body);
}
export async function updateProject(body) {
  return postMethodNormalAPI(updateProjectURL, body);
}
export async function getTemplates(body) {
  return getMethodNormal(getTemplatesURL, body);
}
export async function getProjectsData(body) {
  return getMethodNormal(getProjectsDataURL, body);
}
export async function generateMultiProjectWeeklyReport(body) {
  return postMethodNormalAPI(generateMultiProjectWeeklyReportURL, body);
}
export async function generateReportByDateRange(body) {
  return postMethodNormalAPI(generateReportByDateRangeURL, body);
}
export async function updateCity(body) {
  return postMethodMultiPartAPI(updateCityURL, body);
}
//categories
export async function getAllCategories(token) {
  return getMethodNormal(categoriesURL);
}
export async function addCategory(body) {
  return postMethodMultiPartAPI(categoriesURL, body);
}
export async function updateCategory(body) {
  return postMethodMultiPartAPI(updateCategoryURL, body);
}

//trips
export async function getTestimonials(body) {
  return getMethodNormal(getTestimonialsURL);
}

export async function getTripsWithTitle(body) {
  return getMethodNormal(getTripsWithTitleURL);
}
export async function addTestimonials(body) {
  return postMethodMultiPartAPI(addTestimonialsURL, body);
}
export async function addVideo(body) {
  return postMethodNormalAPI(addVideoURL, body);
}
export async function createCoupons(body) {
  return postMethodNormalAPI(createCouponsURL, body);
}
export async function updateCoupons(body) {
  return postMethodNormalAPI(updateCouponsURL, body);
}
export async function addTrips(body) {
  return postMethodNormalAPI(tripsURL, body);
}
export async function createTimeSheet(body) {
  return postMethodNormalAPI(createTimeSheetURL, body);
}
export async function getTimeSheetByUserId(id) {
  return postMethodNormalAPI(`${getTimeSheetByUserIdURL}${id}`);
}
export async function getTimeSheetByUserIdCurrentMonth(id) {
  return postMethodNormalAPI(`${getTimeSheetByUserIdCurrentMonthURL}${id}`);
}
export async function getUserTimesheetDetails(userId, week) {
  return postMethodNormalAPI(`${getUserTimesheetDetailsURL}/${userId}/${week}`);
}
// export async function deleteVideo(id) {
//   return getMethodNormal(`${deleteVideoURL}${id}`);
// }
export async function getTripById(id) {
  return getMethodNormal(`${tripByIDURL}${id}`);
}
export async function addCityToTrip(body) {
  return postMethodNormalAPI(addCityToTripURL, body);
}
export async function addCategoryInTrip(body) {
  return postMethodNormalAPI(addCategoryInTripURL, body);
}
export async function addDatesToTripsNew(body) {
  return postMethodNormalAPI(addDatesToTripsNewURL, body);
}
export async function deleteDatesToTripsNew(body) {
  return postMethodNormalAPI(deleteDatesToTripsNewURL, body);
}
export async function updateDatesToNew(body) {
  return postMethodNormalAPI(updateDatesToNewURL, body);
}
export async function updateDatesToNewSingleEntry(body) {
  return postMethodNormalAPI(updateDatesToNewSingleEntryURL, body);
}
export async function updateTestimonials(body) {
  return postMethodMultiPartAPI(updateTestimonialsURL, body);
}
export async function removeTripImage(body) {
  return postMethodNormalAPI(removeTripImageURL, body);
}
export async function deleteCityFromTrip(body) {
  return postMethodNormalAPI(deleteCityFromTripURL, body);
}
export async function addImageToTrip(body) {
  return postMethodMultiPartAPI(addImageToTripURL, body);
}
export async function updateTripData(body) {
  return postMethodNormalAPI(updateTripDataURL, body);
}
export async function updatePriceInTrips(body) {
  return postMethodNormalAPI(updatePriceInTripsURL, body);
}
export async function addDatesToTrips(body) {
  return postMethodNormalAPI(addDatesToTripsURL, body);
}
export async function addPriceToTrips(body) {
  return postMethodNormalAPI(addPriceToTripsURL, body);
}
export async function addScheduleToTrip(body) {
  return postMethodMultiPartAPI(addScheduleToTripURL, body);
}
export async function addSliderImagesURL(body) {
  return postMethodMultiPartAPI(sliderImagesURL, body);
}
export async function deleteSliderImage(id) {
  return getMethodNormal(`${deleteSliderImageURL}${id}`);
}
export async function deleteVideo(id) {
  return getMethodNormal(`${deleteVideoURL}${id}`);
}
export async function getSliderImages(body) {
  return getMethodNormal(sliderImagesURL, body);
}
export async function addSection(body) {
  return postMethodNormalAPI(sectionsURL, body);
}
export async function addUser(body) {
  return postMethodNormalAPI(addUserURL, body);
}
export async function generateTimeSheetReport(body) {
  return postMethodNormalAPI(generateTimeSheetReportURL, body);
}
export async function generateProjectWeeklyReport(body) {
  return postMethodNormalAPI(generateProjectWeeklyReportURL, body);
}
export async function updateUser(body) {
  return postMethodNormalAPI(updateUserURL, body);
}
export async function addCustomer(body) {
  return postMethodNormalAPI(addCustomerURL, body);
}
export async function createTemplate(body) {
  return postMethodNormalAPI(createTemplateURL, body);
}
export async function updateTemplate(body) {
  return postMethodNormalAPI(updateTemplateURL, body);
}
export async function updateTemplateDetails(body) {
  return postMethodNormalAPI(updateTemplateDetailsURL, body);
}
export async function deleteTemplateDetails(body) {
  return postMethodNormalAPI(deleteTemplateDetailsURL, body);
}
export async function deleteTodoFromTemplate(body) {
  return postMethodNormalAPI(deleteTodoFromTemplateURL, body);
}
export async function addTemplates(body) {
  return postMethodNormalAPI(addTemplatesURL, body);
}
export async function getProjectById(body) {
  return postMethodNormalAPI(getProjectByIdURL, body);
}
export async function createProject(body) {
  return postMethodNormalAPI(createProjectURL, body);
}
export async function updateSection(body) {
  return postMethodNormalAPI(updateSectionURL, body);
}
export async function addTripInSections(body) {
  return postMethodNormalAPI(addTripInSectionsURL, body);
}
export async function addDetailsToEnquiry(body) {
  return postMethodNormalAPI(addDetailsToEnquiryURL, body);
}
export async function deleteTripFromSection(body) {
  return postMethodNormalAPI(deleteTripFromSectionURL, body);
}

export async function addFaqToTrip(body) {
  return postMethodNormalAPI(addFaqToTripURL, body);
}
export async function addOnToTrip(body) {
  return postMethodNormalAPI(addOnToTripURL, body);
}
export async function removeTripFaq(body) {
  return postMethodNormalAPI(removeTripFaqURL, body);
}
export async function getSections(body) {
  return getMethodNormal(sectionsURL, body);
}
export async function getUsers(body) {
  return getMethodNormal(getUsersURL, body);
}
export async function getTaskMaster(body) {
  return getMethodNormal(getTaskMasterURL, body);
}
export async function createBooking(body) {
  return postMethodNormalAPI(createBookingURL, body);
}
export async function getSectionById(id) {
  return getMethodNormal(`${getSectionByIdURL}${id}`);
}

//dealer URL
const getDealersURL = `${API_URL}/dealer`;
const loginDealerURL = `${API_URL}/dealer/login`;
const activateDealerURL = `${API_URL}/dealer/activate`;
const getDealerByIdURL = `${API_URL}/dealer/`;
const getDealerByCodeURL = `${API_URL}/dealer/filter?code=`;
const generateOTPDealerURL = `${API_URL}/dealer/otp/`;
const verifyOTPDealerURL = `${API_URL}/dealer/verify_otp/`;
const getDealerCustomersURL = `${API_URL}/dealer/customers/`;
const getDealerPurchasesURL = `${API_URL}/dealer/purchases/`;
const getAllPurchasesURL = `${API_URL}/purchase`;
const getPurchasesByStatusURL = `${API_URL}/purchase/filter?status=`;
const getDealersByStatusURL = `${API_URL}/dealer/statusFilter?isactive=`;
const getDealerByStateURL = `${API_URL}/dealer/stateFilter?state=`;
const customerLeaderBoardURL = `${API_URL}/leaderboard/customer`;
const retailerLeaderBoardURL = `${API_URL}/leaderboard/retailer`;

//customer url
const getCustomersURL = `${API_URL}/customer`;
const getTimeSheetURL = `${API_URL}/getTimeSheet`;
const getTimeSheetByUserURL = `${API_URL}/timeSheetUser`;
const getAllCustomersCartsURL = `${API_URL}/getAllCustomersCarts`;
const getEnquiresURL = `${API_URL}/getEnquires`;
const getCustomersStage23URL = `${API_URL}/getstage23customers`;

const generateOTPCustomerURL = `${API_URL}/customer/otp/`;
const verifyOTPCustomerURL = `${API_URL}/customer/otp/validate`;
const getCustomerPurchasesURL = `${API_URL}/customer/purchases/`;
const getCustomerTokensURL = `${API_URL}/customer/tokens`;
const updateCustomerPurchaseURL = `${API_URL}/purchase/`;
const updatePurchaseInvoiceReuploadURL = `${API_URL}/update_purchase_invoice`;
const customerLoginOtpWithoutDealerURL = `${API_URL}/customer/loginotp/`;
const getAllCusomtersURL = `${API_URL}/customer`;
const getAllBookingsURL = `${API_URL}/getAllBookings`;

// admin url
const getAllAdminStatusURL = `${API_URL}/purchase/allstats`;

//API URLS END

//login
export async function loginApiFunction(body) {
  return postMethodNormalAPI(loginURL, body);
}
export async function loginApiFunctionDealer(body) {
  return postMethodNormalAPI(loginDealerURL, body);
}

//Customers
export async function getCustomers() {
  return getMethodNormal(getCustomersURL);
}
export async function getTimeSheet() {
  return getMethodNormal(getTimeSheetURL);
}
export async function getTimeSheetByUser(body) {
  return postMethodNormalAPI(getTimeSheetByUserURL, body);
}
export async function getAllCustomersCarts() {
  return getMethodNormal(getAllCustomersCartsURL);
}
export async function getEnquires() {
  return getMethodNormal(getEnquiresURL);
}
export async function getAllBookings() {
  return getMethodNormal(getAllBookingsURL);
}
export async function getCustomersStage23() {
  return getMethodNormal(getCustomersStage23URL);
}

//Dealers
export async function getDealers(token) {
  return getMethodNormal(getDealersURL);
}
export async function getAllCusomters(token) {
  return getMethodNormal(getAllCusomtersURL);
}
export async function addDealerData(body) {
  return postMethodNormalAPI(getDealersURL, body);
}
export async function activateDealerAPI(body) {
  return postMethodMultiPartAPI(activateDealerURL, body);
}
export async function geDealerById(id) {
  return getMethodNormal(`${getDealerByIdURL}${id}`);
}
export async function geDealerByCode(code) {
  return getMethodNormal(`${getDealerByCodeURL}${code}`);
}
export async function generateOTPDealer(mobile) {
  return postMethodNormalAPI(`${generateOTPDealerURL}${mobile}`);
}
export async function verifyDealerOTP(body) {
  return postMethodNormalAPI(verifyOTPDealerURL, body);
}
export async function getDealerCustomer(id) {
  return getMethodNormal(`${getDealerCustomersURL}${id}`);
}
export async function getDealerPurchases(id) {
  return getMethodNormal(`${getDealerPurchasesURL}${id}`);
}
export async function getAllPurchases() {
  return getMethodNormal(`${getAllPurchasesURL}`);
}
export async function getDealersByStatus(status) {
  return getMethodNormal(`${getDealersByStatusURL}${status}`);
}
export async function getDealerByState(state) {
  return getMethodNormal(`${getDealerByStateURL}${state}`);
}

//customer
export async function generateOTPCustomer(mobile) {
  return getMethodNormal(`${generateOTPCustomerURL}${mobile}`);
}
export async function getCustomerPurchases(customerId) {
  return getMethodNormal(`${getCustomerPurchasesURL}${customerId}`);
}
export async function verifyOTPCustomer(body) {
  return postMethodNormalAPI(verifyOTPCustomerURL, body);
}
export async function addInvoice(body) {
  return postMethodMultiPartAPI(getCustomersURL, body);
}
export async function getCustomerById(id) {
  return getMethodNormal(`${getCustomersURL}/${id}`);
}
export async function getCustomerTokens(id) {
  return getMethodNormal(`${getCustomerTokensURL}/${id}`);
}
export async function customerLoginOtpWithoutDealer(mobile) {
  return getMethodNormal(`${customerLoginOtpWithoutDealerURL}${mobile}`);
}
export async function updateCustomerPurchase(purchaseID, body) {
  return postMethodNormalAPIPUT(
    `${updateCustomerPurchaseURL}${purchaseID}`,
    body
  );
}
export async function getPurchaseDetailsById(purchaseID) {
  return getMethodNormal(`${updateCustomerPurchaseURL}${purchaseID}`);
}
export async function updateCustomerPurchaseReupload(body) {
  return postMethodMultiPartAPI(`${updatePurchaseInvoiceReuploadURL}`, body);
}

// Functions end //

// admin  panel sections
export async function getPurchasesByStatus(status) {
  return getMethodNormal(`${getPurchasesByStatusURL}${status}`);
}
export async function getAllAdminStatus(status) {
  return getMethodNormal(`${getAllAdminStatusURL}`);
}

export async function getCustomerLeaderBoard() {
  return getMethodNormal(`${customerLeaderBoardURL}`);
}
export async function getRetailerLeaderBoard() {
  return getMethodNormal(`${retailerLeaderBoardURL}`);
}
