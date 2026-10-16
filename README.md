# ZTD Devs Studio projects

A backup of every project's committed code, pushed by ZTD Devs Studio. Each project is on its own
branch, `projects/<name>`, with its full history. Uncommitted changes aren't included.

To give a project a repo of its own: `git push <new-repo> origin/projects/<name>:refs/heads/main`

- **pipeline**, branch `projects/pipeline`: Pipeline: limit each board to one AI worker at a time (0ad7c15, 2026-10-15)
- **studio-src**, branch `projects/studio-src`: Studio: GitHub backup pushes each project to its own branch (projects/<name>) (aa01c78, 2026-10-16)
