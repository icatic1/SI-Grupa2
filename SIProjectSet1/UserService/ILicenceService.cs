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
        Task<bool> AddTerminalDebug(String MacAddress, String Terminal, Boolean Debug);
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

        public async Task<Licence> GetTerminalAndDebug(String MacAddress)
        {
            var licence = await _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            return licence;
        }

        public async Task<bool> AddTerminalDebug(String MacAddress, String Terminal, Boolean Debug)
        {
            var licence = await _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            if (licence == null) return false;

            licence.TerminalID = Terminal;
            licence.DebugLog = Debug;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
