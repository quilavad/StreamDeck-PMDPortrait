using StreamDeckLib;
using StreamDeckLib.Messages;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.IO;

namespace PMDPortrait
{
  [ActionUuid(Uuid="quilavad.pmdportrait.DefaultPluginAction")]
  public class PMDPortraitAction : BaseStreamDeckActionWithSettingsModel<Models.PMDPortraitModel>
  {
		private Thread thread;
		private DateTime resetTime;
		private StreamDeckEventPayload aTemp;
		private static readonly string[] names = { "Happy", "Pain", "Angry", "Worried", "Sad", "Crying", "Shouting", "Teary-Eyed", "Determined", "Joyous", "Inspired", "Surprised", "Dizzy", "Sigh", "Stunned" };

        private async void Reset()
		{
			while (DateTime.Now <= resetTime)
			{
                System.Threading.Thread.Sleep(resetTime.Subtract(DateTime.Now));
            }
            await Manager.SetImageAsync(aTemp.context, getFormPath("assets/portrait/") + "Normal.png");
        }

		private string getFormPath(string path)
        {
			path += SettingsModel.DexNo.ToString("0000") + "/";
			if (SettingsModel.Form != 0 || SettingsModel.Shiny)
			{
				path += SettingsModel.Form.ToString("0000") + "/";
			}
			if (SettingsModel.Shiny)
			{
				path += "0001/";
			}
			return path;
		}

		public override async Task OnKeyUp(StreamDeckEventPayload args)
		{
            //await Manager.SetTitleAsync(args.context, SettingsModel.DexNo.ToString());
            Random rnd = new Random();

            await Manager.SetImageAsync(args.context, getFormPath("assets/portrait/") + names[rnd.Next(names.Length)] + ".png");

            resetTime = DateTime.Now.AddMilliseconds(SettingsModel.Duration);
            aTemp = args;
			if (thread == null)
			{
				thread = new Thread(Reset);
				thread.Start();
			}
			else if (!thread.IsAlive)
			{
				thread = new Thread(Reset);
				thread.Start();
			}
        }

		public override async Task OnDidReceiveSettings(StreamDeckEventPayload args)
		{
			await base.OnDidReceiveSettings(args);
            await Manager.SetImageAsync(aTemp.context, getFormPath("assets/portrait/") + "Normal.png");
        }

		public override async Task OnWillAppear(StreamDeckEventPayload args)
		{
			await base.OnWillAppear(args);
		}

	}
}
