
import { Card } from '../ui/card'

const ImportantNotes = () =>
{
  return (
    <div>
      <section className="py-10">
        <div className="container mx-auto px-4">
          <Card className="border-accent/30 bg-accent/5 p-6">
            <h2 className="font-display text-lg font-bold mb-3">
              📌 Important Notes
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>
                Correct page orientation is important. If pages are not
                correctly oriented, this may lead to pages being upside down
                after printing.
              </li>
              <li>
                Upload file name should not contain spaces or special
                characters. Use descriptive names like:{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  masparesfront
                </code>
                ,{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  masparesback
                </code>
                ,{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  masparesUVfile
                </code>
                .
              </li>
              <li>
                Accepted file formats: <strong>PDF</strong> (recommended), JPEG,
                PNG. CDR format is not allowed.
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default ImportantNotes