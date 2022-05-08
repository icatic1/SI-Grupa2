using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Entities;
using SIProjectSet1.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.LicenceService
{
    public interface ILicenceService
    {
        Task<Licence> CheckLicence(String MacAddress);
        Task<Licence> GetTerminalAndDebug(String MacAddress);
        Task<bool> UpdateTerminalDebug(String MacAddress, String Terminal, Boolean Debug);
        Task<bool> InitialAddDevice(string macAddress, string terminalID, bool debugLog);
        Task<List<Licence>> GetAllLicences();
        Task<List<Device>> GetAllDevices();

        Task<Device> GetDevice(String MacAddress);

        Task<bool> InitialAddDevice(String MacAddress, String Terminal);
    }

    public class LicenceService : ILicenceService
    {
        private readonly ILogger<LicenceService> _logger;
        private readonly SIProjectSet1Context _context;

        public LicenceService(ILogger<LicenceService> logger, SIProjectSet1Context context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<Licence> CheckLicence(String MacAddress)
        {
            var licence = await _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            return licence;
        }

        public async Task<List<Device>> GetAllDevices()
        {
            var device = await _context.Devices.ToListAsync();
            return device;
        }

        public async Task<List<Licence>> GetAllLicences()
        {
            var licence = await _context.Licences.ToListAsync();
            return licence;
        }

        public async Task<Device> GetDevice(String MacAddress)
        {
            var device = await _context.Devices.FirstOrDefaultAsync(device => device.MacAddress == MacAddress);
            return device;
        }

        public async Task<Licence> GetTerminalAndDebug(String MacAddress)
        {
            var licence = await _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            return licence;
        }

        public async Task<bool> UpdateTerminalDebug(String MacAddress, String Terminal, Boolean Debug)
        {
            var licence = await _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            if (licence == null) return false;

            licence.TerminalID = Terminal;
            licence.DebugLog = Debug;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> InitialAddDevice(String MacAddress, String Terminal, Boolean Debug)
        {
            try
            {
                var licence = new Licence() { MacAddress = MacAddress, TerminalID = Terminal, DebugLog = Debug, Licenced = false };
                _context.Licences.Add(licence);
                var device = new Device() { MacAddress = MacAddress, TerminalID = Terminal};
                _context.Devices.Add(device);
                await _context.SaveChangesAsync();

                return true;
            } catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> InitialAddDevice(String MacAddress, String Terminal)
        {
            try
            {
                var device = new Device() { MacAddress = MacAddress, TerminalID = Terminal };
                _context.Devices.Add(device);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
