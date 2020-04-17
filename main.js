
const nodeProcessWindows = require('node-window-manager');
const EventEmitter = require('events');

module.exports = class ProcessListen {

	constructor(processArr) {
		this.eventEmitter = new EventEmitter.EventEmitter();
		this.processArr = processArr;
		this.activeWindow = undefined;
		this.openedProcesses = [];
		setTimeout(() => {
			this.loop(true);
		});
	}

	changed(cb) {
		this.eventEmitter.on("changed", data => {
			if (!data) return cb(undefined);
			cb({
				title: data.getTitle(),
				pid: data.processId,
			})
		})
	}

	async loop(started) {
		const processes = nodeProcessWindows.windowManager.getWindows();

		const newOpenedProcesses = this.processArr.map(pa => {
			return processes.find(p => {
				return p.path.indexOf(pa, p.path.length - pa.length) != -1;
			})
		}).filter(pa => pa)

		const closedProgramsArr = this.openedProcesses.filter(x => {
			return !newOpenedProcesses.find(a => a.path === x.path)
		});

		if (started) {
			if (newOpenedProcesses.length) {
				this.eventEmitter.emit('changed', newOpenedProcesses[0]);
				this.activeWindow = newOpenedProcesses[0];
			}
		}

		closedProgramsArr.forEach(cp => {
			if (cp.path === this.activeWindow.path) {
				if (newOpenedProcesses.length) {
					this.eventEmitter.emit('changed', newOpenedProcesses[0]);
					this.activeWindow = newOpenedProcesses[0];
				} else {
					this.eventEmitter.emit('changed', undefined);
					this.activeWindow = undefined
				}
			}
		})


		this.openedProcesses = newOpenedProcesses;

		const activeWindow = nodeProcessWindows.windowManager.getActiveWindow();

		if ((!this.activeWindow || this.activeWindow.processId !== activeWindow.processId) && this.processArr.find(pa => activeWindow.path.indexOf(pa, activeWindow.path.length - pa.length) != -1)) {
			this.eventEmitter.emit('changed', activeWindow);
			this.activeWindow = activeWindow;
		}


		setTimeout(() => this.loop(), 1000);
	}

}