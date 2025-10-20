import Router from 'express';

const router = Router()

router.get('/notr/app/version', (req, res) => {
  res.status(200).send({
    latestVersion: "1.0.1",
    date : "October 2025",
    apkUrl : `https://download2296.mediafire.com/tpib0vuwcmsgNSK-7x8e7fyk8QwKHWNbmwUfKS_W0TNP32N5ZpBu-UFxNhu9EBnBeXfnlQ6Do4frShF4-J1clJByCrjSSfs4jstLOAVDY7QT9qCz57gH8E0sqKJyzudjW7HBTtwtT_QmNWy7dlzOL2foaHesZWntYHFXvCJgMHLSIXJZ/3f77tn2z8ihyjb0/notr-main-eb1728-release.apk`,
    versionNote: {
      hight: [
        {
          title: 'Search improvement',
          desc: 'Search posts using keyword in notes.'
        },
        {
          title: 'Performance and stability',
          desc: 'Improvement stability and Performance for smoother experience.'
        },
        {
          title: 'Find curated posts',
          desc: 'Filter posts based on their tags'
        }
      ],
      fixes: [
        'Fixed rare crash when loading profile page'
      ]
    }
  })
})

export default router