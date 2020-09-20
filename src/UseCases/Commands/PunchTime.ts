import * as vscode from "vscode";
import TaskInterface from "../../Entities/Interfaces/TaskInterface";
import TimeEntryInterface from "../../Entities/Interfaces/TimeEntryInterface";
import Project from "../../Entities/Project";
import ProjectCollection from "../../Entities/ProjectCollection";
import saveNewTimeEntry from "../saveNewTimeEntry";
import SetupHarvest from "../SetupHarvest"


function PunchTime (context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand('harvest-vscode.punchTime', async () => {
    let projectCollection = new ProjectCollection()
    const isHarvestSetup = await SetupHarvest(context)
    if (!isHarvestSetup) return

    const projectNames = projectCollection.elements.map((p: Project) => {
      return p.name
    })

    const selectedProjectName = await vscode.window.showQuickPick(projectNames, {
      ignoreFocusOut: true,
      placeHolder: 'Choost a Project'
    })

    if (!selectedProjectName) {
      vscode.window.showWarningMessage('Must select a project to push time')
      return
    }

    const selectedProject = projectCollection.findByName(selectedProjectName)

    const taskNames = selectedProject?.tasks.map((t: TaskInterface) => {
      return t.name
    })

    if (!taskNames) {
      vscode.window.showWarningMessage('No tasks defined for this project.')
      return
    }

    const selectedTaskName = await vscode.window.showQuickPick(taskNames, {
      ignoreFocusOut: true,
      placeHolder: 'Choost a Task'
    })

    if (!selectedTaskName) {
      vscode.window.showWarningMessage('Must select a task to push time')
      return
    }

    const selectedTask = selectedProject?.tasks.find((t: TaskInterface) => {
      return t.name === selectedTaskName
    })

    // console.log(selectedProject?.tasks[0])
    // console.log(selectedProject?.tasks[1])
    // console.log(selectedProject?.tasks[2])
    console.log(selectedTask)

    const notes = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: 'Notes'
    })

    if (!notes) {
      vscode.window.showWarningMessage('Must add notes to puch time.')
      return
    }

    const newTimeEntry: TimeEntryInterface = {
      projectId: selectedProject!.id,
      taskId: selectedTask!.id,
      date: new Date().toISOString(),
      notes: notes
    }

    console.log(newTimeEntry)

    const saveNewTimeEntryResponse = await saveNewTimeEntry(newTimeEntry)

    console.log(saveNewTimeEntryResponse)
  })
}

export default PunchTime