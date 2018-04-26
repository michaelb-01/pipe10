export const jobsData = [
  {
    _id:1,
    name:'Nike',
    startDate: new Date("2018-03-26T07:54:57+00:00"),
    endDate: new Date("2018-04-03T07:54:57+00:00")
  },
  {
    _id:2,
    name:'BMW',
    startDate: new Date("2018-02-26T07:54:57+00:00"),
    endDate: new Date("2018-04-15T07:54:57+00:00")
  }
]

export const usersData = [
  {
    _id:'1',
    name: 'Mike Battcock',
    jobs: [
      {
        jobId: 1,
        name:'Nike',
        startDate: new Date("2018-03-26T07:54:57+00:00"),
        endDate: new Date("2018-04-03T07:54:57+00:00")
      },
      {
        jobId: 2,
        name:'BMW',
        startDate: new Date("2018-02-26T07:54:57+00:00"),
        endDate: new Date("2018-03-24T07:54:57+00:00")
      }
    ]
  },
  {
    _id:'2',
    name: 'Ben Cantor',
    jobs: [
      {
        jobId: 1,
        name:'Nike',
        startDate: new Date("2018-03-24T07:54:57+00:00"),
        endDate: new Date("2018-03-27T07:54:57+00:00")
      },
      {
        jobId: 2,
        name:'BMW',
        startDate: new Date("2018-04-01T07:54:57+00:00"),
        endDate: new Date("2018-04-04T07:54:57+00:00")
      }
    ]
  },
  {
    _id:'3',
    name: 'Sam Osborne',
    jobs: [
      {
        jobId: 1,
        name:'Nike',
        startDate: new Date("2018-03-24T07:54:57+00:00"),
        endDate: new Date("2018-03-29T07:54:57+00:00")
      },
      {
        jobId: 2,
        name:'BMW',
        startDate: new Date("2018-03-31T07:54:57+00:00"),
        endDate: new Date("2018-04-06T07:54:57+00:00")
      }
    ]
  }
]