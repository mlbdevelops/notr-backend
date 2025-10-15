import Router from 'express';

const router = Router()

router.get('/notr/app/version', (req, res) => {
  res.status(200).send({
    latestVersion: "1.0.0",
    date : "October 2025",
    apkUrl : `https://pro-app-storage.s3.amazonaws.com/builds/6d5db789-b23b-4ef8-b31d-96ccc9e34228-release.apk?AWSAccessKeyId=ASIAUUWEHETW6KFUDXXX&Signature=xgpeajUWrSf%2FudnYiVlSzs8ybEk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIHAJllfIvmFWe3zNsUA%2FxNLQ%2F8TWcEQofnRqDj9cHGjxAiAOWtsQjHZrKdcEGVmuCgv9yfkq%2BTScU%2BTCMskcr5bXKyqbBAgdEAAaDDMxOTMxMjgzMTcyNSIM%2BFlIEzC0WHrCxIg9KvgDLyvKsKrMB4fu45nvztg9MF8dwzHJTi%2F1CNzrBIC6W8MTI8rDVKyzLVl2C%2BaWS%2FNrarVubBuZraDnKeMUe39CAfPf5is14oC6i%2FSDUi%2Fn6XP6CcyxY1nxthoBpONUYkBLBvw6lEPA53wedZMSxYfxIHi9p%2FjWrfBr%2Fl7k8D74eDarML%2FlhukQEgJxq1QgkDR%2FAJUU7h0N0kIQViwf0yIpG%2FgvZi6Gqay4TGrDh8OWh%2FBawN8nqFjJe6NHvmhEutn261HEYRZVQg9%2Byl8kTd8RHMEG836S%2BVgWdJjwArSLhudr4uyhB9JZVmde7mLzNjsLEmQ2BwhI6YQwRBViQEfaEpIO8sAhaIy3vo1PXu6Yd8s8x1f%2FCnNBFMApa6O8FAIpONgHNjVDnExDp9yLrxB3tvDIKslISc6LaWixJpqp0Bfvc3TV0Dr9x%2BWmcbwgmahJIj9qMfBF%2Fx8L%2B2qFxsPudutwlKb8%2Byt1X2tQBhVPWkp2lx%2FAb%2FKp7f0UXXKH8AhUN49qUGK%2F6wsx2%2FH7U83AA7%2F2GCHrtIP4KeQJJT0WMATGkC1aq1ppuZtGDGai99tFASs6qL9cy4q8CVkF4vTjzaCZcQu7cdODl42I%2BWtzxs76aWR%2F6oabgdQ0%2FgbeLdL2D8yPclaSooLVYyFVu5pGUD4jv%2BtSp%2BFyMJDiqscGOqcB5mosmgVqyg%2FbkNMlZBnddjHZA9vOyVeIjHZ9KYPp2ytnf7uM932Fsen5SsTQ8MMln1qgKHJG80bivOnuAPv9fO1BjQVCkRAs9yqq86hyTzTUeZM5KxhJVXENjzsQx3t0nqKQ%2BQps%2FCCKmHieYyjNTomYrFXT0Xaqr0JVOn1SztiUA3oqFVHbxGWAZw9hkJue0ROof39yzA%2Fs4CT%2FgZl7TUGBLo6kjiQ%3D&Expires=1760232274`,
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