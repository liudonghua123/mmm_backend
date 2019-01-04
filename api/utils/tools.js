const tools = {
  parseSort: (sortQuery) => {
    try {
      // sortQuery are like id.asc,name.desc
      const segments = sortQuery.split(/[,;]/);
      const sorts = [];
      segments.forEach((segment) => {
        const [field, order] = segment.split(/[.]/);
        if (order.toUpperCase() === 'ASC' || order.toUpperCase() === 'DESC') {
          sorts.push([field, order.toUpperCase()]);
        }
      });
      return sorts;
    } catch (error) {
      console.info(`parseSort(${sortQuery}) error with ${error}`);
      return [];
    }
  },
};

module.exports = tools;
