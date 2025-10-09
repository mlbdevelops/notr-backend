import Router from 'express';

const router = Router()

router.get('/notr/app/version', (req, res) => {
  res.status(200).send({
    latestVersion: "1.0.0",
    date : "2025/03/07",
    apkUrl : "null",
    versionNote: {
      hight: [
        {
          title: 'Tracy'
        }
      ]
    }
  })
})

export default router