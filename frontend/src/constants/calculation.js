export const calculateTimeAgo = (creationDate) => {
  const createdDate = new Date(creationDate * 1000);
  const currentDate = new Date();
  const differenceInMs = currentDate - createdDate;
  const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m`; // Return minutes if less than 1 hour
  }
  if (differenceInHours < 24) {
    return `${differenceInHours}h`; // Return hours if less than 1 day
  }
  if (currentDate.getFullYear() === createdDate.getFullYear()) {
    return createdDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }); // Return short date if in the same year
  }
  return createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }); // Return full date if in a different year
};

export const formatCount = (count) => {
  if (count >= 1000000)
    return (count / 1000000).toFixed(1).replace(".0", "") + "M";
  if (count >= 1000) return (count / 1000).toFixed(1).replace(".0", "") + "k";
  return count;
};

export const formatFullDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    
    // Get the hour and minute in 12-hour format
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Format the hour and minute (e.g., "3:17 AM")
    const formattedTime = `${((hours % 12) || 12)}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    
    // Get the short month, day, and year
    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  
    // Combine time and date with "·" separator
    return `${formattedTime} · ${formattedDate}`;
  };
  
