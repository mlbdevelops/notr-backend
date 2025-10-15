import Router from 'express';

const router = Router()

router.get('/notr/app/version', (req, res) => {
  res.status(200).send({
    latestVersion: "1.0.0",
    date : "October 2025",
    apkUrl : `null`,
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