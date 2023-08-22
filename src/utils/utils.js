import { axiosReq } from "../api/axiosDefaults";
// Fetch data on demand for infinite scroll element
export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {}
};
/* Convert date object that comes back from the API to fit the React Bootstrap components, which are
  basically HTML-Components wrapped in bootstrap CSS
  @parameter dateString
    The incoming date format is a string that looks like this: 24 Aug 2023 21:14
  @return value
    The DOM-components expect a format that looks like this : 2023-08-05 21:14  
*/
export const convertDateFormat = (dateString) => {
  const split = dateString.split(" ");
  const incomingMonths = ["Jan", "Feb", "Mar", "Apr","May", "Jun", "Jul",  "Aug", "Sep", "Oct", "Nov", "Dec"];
  const outgoingMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const day = split[0];
  let month = split[1];
  const year = split[2];
  const time = split[3];

  for(let i=0; i < incomingMonths.length; i++){
    if(incomingMonths[i].toLowerCase() === month.toLowerCase()){
      month = outgoingMonths[i];
    }
  }

  return ""+year+"-"+month+"-"+day+" "+time;  
}

/*
  Convert Date object to String Expected by react datepicker
*/
export const convertDateToReactString = (date) => {
  let day = date.getDate();
  // Since the months in Date are numbered 0-11, need to add 1
  let month = date.getMonth()+1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const getFormat = (num) => {
    if(num < 10){
      return "0"+num;
    }
    return num;
  }
  day = getFormat(day);
  month = getFormat(month);
  hours = getFormat(hours);
  minutes = getFormat(minutes);
  
  return ""+year+"-"+month+"-"+day+" "+hours+":"+minutes;
}